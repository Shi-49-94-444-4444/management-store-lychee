import axiosInstance from "@/libs/axios";
import { CreateTransactionParams } from "@/types";

export const createTransactionService = async (data: CreateTransactionParams) => {
    try {
        const response = await axiosInstance.post('/transaction/create', data)

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
};