import axiosInstance from "@/libs/axios";

export const addStockToProductService = async (productId: string, quantity: number, productionDate: string, userId: string) => {
    try {
        const response = await axiosInstance.post('/stock/addStock', { productId, quantity, productionDate, userId });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Network error');
        }
    }
};

export const deleteStockService = async (stockId: string) => {
    try {
        const response = await axiosInstance.delete(`/stock/deleteStock?stockId=${stockId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Network error');
        }
    }
};

export const transferService = async (stockId: string, quantity: number, targetStoreId: string, userId: string) => {
    try {
        const response = await axiosInstance.post('/stock/transfer', { stockId, quantity, targetStoreId, userId });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Network error');
        }
    }
};