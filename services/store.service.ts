import axiosInstance from "@/libs/axios";

export const addStoreService = async (name: string, address: string) => {
    try {
        const response = await axiosInstance.post('/store/add', { name, address })

        return response.data
    } catch (error: any) {
        if (error && error.response) {
            return error.response.data
        }
    }
};
