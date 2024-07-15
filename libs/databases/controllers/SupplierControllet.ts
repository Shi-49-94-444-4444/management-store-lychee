import Supplier, { ISupplier } from "../models/Supplier";

export const getAllSupplier = async (): Promise<ISupplier[]> => {
    try {
        const suppliers = await Supplier.find();
        return suppliers;
    } catch (error: any) {
        throw new Error(error.message);
    }
};