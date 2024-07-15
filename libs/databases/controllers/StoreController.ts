import Store, { IStore } from '../models/Store';

export const getAllStores = async (): Promise<IStore[]> => {
    try {
        const stores = await Store.find()
            .populate('users', '_id')
            .populate('products', 'totalStock')
            .populate('transactions');
        return stores;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getById = async (storeId: string): Promise<IStore | null> => {
    try {
        const stores = await Store.findById(storeId)
            .populate('users', '_id')
            .populate('products', 'totalStock')
            .populate('transactions');
        return stores;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addStore = async (name: string, address: string): Promise<IStore> => {
    try {
        const existingStore = await Store.findOne({ $and: [{ name }, { address }] });

        if (existingStore) {
            throw new Error('Chi nhánh không được trùng tên và địa chỉ');
        }

        const newStore = new Store({
            name,
            address,
            users: [],
            products: [],
            transactions: []
        });

        await newStore.save();
        return newStore;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
