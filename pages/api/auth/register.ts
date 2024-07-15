import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/libs/databases/mongoose';
import { register } from '@/libs/databases/controllers/UserController';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, username, password, phone, role, storeId, createdBy } = req.body;

        try {
            const newUser = await register({ email, username, password, phone, role, storeId, createdBy });
            res.status(200).json({ data: newUser, message: "Tài khoản đã được cấp thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
