import Product, { IProduct } from "../models/Product";
import Stock, { IStock } from "../models/Stock";
import User from "../models/User";

export const getAllStocks = async (productId: string): Promise<IStock[]> => {
    try {
        const stocks = await Stock.find({ product: productId, isDelete: false }).populate('product');

        return stocks;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addStockToProduct = async (productId: string, quantity: number, productionDate: string, userId: string): Promise<IStock> => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        const parsedProductionDate = new Date(productionDate);
        const expiryAt = new Date(parsedProductionDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const today = new Date();

        const daysToExpiry = Math.ceil((expiryAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysToExpiry <= 0) {
            throw new Error('Hàng gần hết hạn hoặc đã hết hạn, không thể thêm vào kho');
        }

        const stock = new Stock({
            product: productId,
            quantity,
            productionDate: parsedProductionDate,
            expiryAt: expiryAt,
            user: userId
        });

        await stock.save();

        product.updatedAt = new Date();
        product.stocks.push(stock._id);
        await product.save();

        return stock;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteStock = async (stockId: string): Promise<void> => {
    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            throw new Error('Không tìm thấy kho hàng');
        }

        if (stock.quantity < 0) {
            throw new Error('Kho hàng đã hết hàng');
        }

        const product = await Product.findById(stock.product);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        stock.isDelete = true;
        stock.updatedAt = new Date();
        await stock.save();

        product.updatedAt = new Date();
        await product.save();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

interface TransferStockInput {
    stockId: string;
    quantity: number;
    targetStoreId: string;
    userId: string;
}

export const transferStock = async ({ stockId, quantity, targetStoreId, userId }: TransferStockInput): Promise<void> => {
    try {
        const stock = await Stock.findById(stockId).populate<{ product: IProduct }>('product');
        if (!stock) {
            throw new Error('Kho hàng không tồn tại');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        if (user.role === 'staff') {
            throw new Error('Người dùng không đủ quyền');
        }

        if (quantity > stock.quantity) {
            throw new Error('Số lượng yêu cầu vượt quá số lượng tồn kho');
        }

        if (stock.status === 'near expiry' || stock.status === 'expired') {
            throw new Error('Không thể chuyển kho hàng gần hết hạn hoặc đã hết hạn');
        }

        const product = stock.product;
        if (product.store.toString() === targetStoreId) {
            throw new Error('Chi nhánh muốn chuyển trùng với chi nhánh hiện tại');
        }

        const existingProduct = await Product.findById(stock.product);

        let targetProduct = await Product.findOne({
            name: existingProduct.name,
            supplier: existingProduct.supplier,
            store: targetStoreId,
        });

        if (targetProduct) {
            const newStock = new Stock({
                product: targetProduct._id,
                quantity,
                productionDate: stock.productionDate,
                expiryAt: stock.expiryAt,
                user: userId
            });

            await newStock.save();

            targetProduct.stocks.push(newStock);
            await targetProduct.save();
        } else {
            const newProduct = new Product({
                name: existingProduct.name,
                price: existingProduct.price,
                description: existingProduct.description,
                supplier: existingProduct.supplier,
                store: targetStoreId,
                user: existingProduct.user,
                imageUrl: existingProduct.imageUrl,
            });

            await newProduct.save();

            const newStock = new Stock({
                product: newProduct._id,
                quantity,
                productionDate: stock.productionDate,
                expiryAt: stock.expiryAt,
                user: userId
            });

            await newStock.save();

            newProduct.stocks.push(newStock);
            await newProduct.save();
        }

        stock.quantity -= quantity;

        if (stock.quantity === 0) {
            stock.isDelete = true;
        }

        await stock.save();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateStockStatus = async () => {
    const stocks: IStock[] = await Stock.find({});

    const now = new Date();

    for (const stock of stocks) {
        const expiryThreshold = new Date(stock.expiryAt);
        expiryThreshold.setDate(expiryThreshold.getDate() - 1); // Hết hạn khi còn 1 ngày

        let newStatus: 'normal' | 'near expiry' | 'expired' = 'normal';

        if (now > stock.expiryAt) {
            newStatus = 'expired';
        } else if (now > expiryThreshold) {
            newStatus = 'near expiry';
        }

        if (stock.status !== newStatus) {
            stock.status = newStatus;
            await stock.save();
        }
    }
};
