import { number } from "yup";

export interface CreateTransactionParams {
    userId: string;
    storeId: string;
    cart: {
        product: {
            _id: string;
            price?: number;
        };
        quantity: number;
    }[];
    paymentMethod: boolean;
    status: string;
}

export interface TransactionDetail {
    _id: string
    user: {
        _id: string
        email: string
        username: string
        phone: number
    }
    store: {
        name: string
    }
    products: {
        product: {
            _id: string
            name: string
            price: number
            imageUrl: string
        }
        quantity: number
    }[]
    totalPrice: number
    status?: string
    createdAt: string
    reason?: string
    refundMoney?: number
    refundByUser?: string
}

export interface Refund {
    price: number
    reason: string
}