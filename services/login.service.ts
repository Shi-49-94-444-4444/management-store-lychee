import axiosInstance from '@/libs/axios';
import { LoginFormData } from '@/types';

export const loginService = async (data: LoginFormData) => {
    try {
        const response = await axiosInstance.post('/auth/login', data)

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
};
