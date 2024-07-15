import axiosInstance from "@/libs/axios";
import { CreateProductInput } from "@/types";


export const postProductService = async (data: CreateProductInput) => {
    try {
        const response = await axiosInstance.post('/product/post', {
            ...data,
        })

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
};

export const deleteProductService = async (productId: string) => {
    try {
        const response = await axiosInstance.put('/product/delete', {
            productId
        })

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
}