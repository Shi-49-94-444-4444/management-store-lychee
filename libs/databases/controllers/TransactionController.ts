import { CreateTransactionParams } from "@/types";
import Product from "../models/Product";
import Transaction, { ITransaction } from "../models/Transaction";
import { vnpayCreatePayment } from "../services/vnpay";
import Store from "../models/Store";
import Stock from "../models/Stock";

export const createTransaction = async (input: CreateTransactionParams) => {
    const { userId, storeId, cart, paymentMethod, status } = input;
    const transactionProducts: any[] = [];

    for (const cartItem of cart) {
        const product = await Product.findById(cartItem.product._id).populate('stocks');

        if (!product) {
            throw new Error(`Sản phẩm ${cartItem.product._id} không tồn tại`);
        }

        if (product.store.toString() !== storeId) {
            throw new Error(`Sản phẩm ${product.name} không thuộc cửa hàng này`);
        }

        let remainingQuantity = cartItem.quantity;
        const productStocks = product.stocks
            .filter((stock: any) => (stock.isDelete !== "returned") && new Date(stock.expiryAt) > new Date())
            .sort((a: any, b: any) => new Date(a.expiryAt).getTime() - new Date(b.expiryAt).getTime());

        for (const stock of productStocks) {
            if (remainingQuantity <= 0) break;

            if (stock.quantity >= remainingQuantity) {
                transactionProducts.push({ product: product._id, quantity: remainingQuantity, stock: stock._id });
                remainingQuantity = 0;
            } else {
                transactionProducts.push({ product: product._id, quantity: stock.quantity, stock: stock._id });
                remainingQuantity -= stock.quantity;
            }
        }

        if (remainingQuantity > 0) {
            throw new Error(`Không đủ hàng tồn kho ${product.name}`);
        }
    }

    const totalPrice = cart.reduce((total: number, item: any) => total + (item.product.price || 0) * item.quantity, 0);

    const transaction = new Transaction({
        user: userId,
        store: storeId,
        products: transactionProducts,
        totalPrice,
        status,
    });

    await transaction.save();

    await Store.findByIdAndUpdate(storeId, {
        $push: { transactions: transaction._id }
    });

    if (!paymentMethod) {
        await saveTransaction(transaction._id.toString());
        return transaction;
    } else {
        const paymentUrl = vnpayCreatePayment(transaction._id.toString(), totalPrice);
        return { paymentUrl, transactionId: transaction._id };
    }
};

export const saveTransaction = async (transactionId: string) => {
    const transaction = await Transaction.findById(transactionId).populate('products.product products.stock');
    if (!transaction) {
        throw new Error(`Giao dịch ${transactionId} không tồn tại`);
    }

    for (const transactionProduct of transaction.products) {
        const stock = transactionProduct.stock;
        if (stock.quantity < transactionProduct.quantity) {
            throw new Error(`Không đủ hàng tồn kho cho sản phẩm ${transactionProduct.product.name}`);
        }

        stock.quantity -= transactionProduct.quantity;
        await stock.save();

        const product = transactionProduct.product;
        product.sale += transactionProduct.quantity;
        await product.save();
    }

    transaction.status = 'successful';
    await transaction.save();
};

export const removeTransaction = async (transactionId: string) => {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        throw new Error(`Giao dịch ${transactionId} không tồn tại`);
    }

    transaction.status = 'failed';
    await transaction.save();
};

export interface ITransactionFilter {
    storeId?: string
}

export const getAllTransactions = async (filter: ITransactionFilter): Promise<ITransaction[]> => {
    try {
        const { storeId } = filter

        const query: any = {};

        if (storeId) {
            query['store'] = storeId;
        }

        const transactions = await Transaction.find(query).populate('user').populate('products.product').populate('store', 'name').sort({ createdAt: -1 });
        return transactions;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export interface FilterParams {
    startDate: Date;
    endDate: Date;
    storeId?: string;
}

export const getFilteredWalletHistory = async (params: FilterParams): Promise<ITransaction[]> => {
    const { startDate, endDate, storeId } = params;

    if (!startDate || !endDate || startDate > endDate) {
        throw new Error('Phạm vi ngày không hợp lệ');
    }

    const filter: Record<string, any> = {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'failed' },
    };

    if (storeId) {
        filter.store = storeId;
    }

    try {
        const filteredHistory = await Transaction.find(filter).populate('store', 'name');
        return filteredHistory;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const createRefundTransaction = async (originalTransactionId: string, refundingUserId: string, price: number, reason: string) => {
    const originalTransaction = await Transaction.findById(originalTransactionId).populate('products.product products.stock');

    if (!originalTransaction) {
        throw new Error(`Giao dịch ${originalTransactionId} không tồn tại`);
    }

    if (originalTransaction.status !== 'successful') {
        throw new Error('Chỉ có thể hoàn tiền cho giao dịch thành công');
    }

    originalTransaction.status = 'refunded'
    originalTransaction.reason = reason
    originalTransaction.refundMoney = price
    originalTransaction.refundByUser = refundingUserId

    await originalTransaction.save();

    for (const product of originalTransaction.products) {
        const stock = await Stock.findById(product.stock);
        if (stock) {
            stock.quantity += product.quantity;
            await stock.save();
        }

        const prod = await Product.findById(product.product);
        if (prod) {
            prod.sale -= product.quantity;
            await prod.save();
        }
    }

    return originalTransaction;
};
