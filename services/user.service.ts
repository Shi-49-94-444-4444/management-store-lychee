import axiosInstance from "@/libs/axios";
import { RegisterForm } from "@/types";

export const blockUserService = async (currentUser: string, userToLock: string) => {
    try {
        const response = await axiosInstance.put('/user/locked', { currentUser, userToLock })

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
};

export const registerService = async (data: RegisterForm) => {
    try {
        const response = await axiosInstance.post('/auth/register', {
            email: data.email,
            username: data.username,
            password: data.password,
            phone: data.phone,
            role: data.role,
            storeId: data.storeId,
            createdBy: data.createdBy
        })

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
};