import { lockUserAccount } from '@/libs/databases/controllers/UserController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { currentUser, userToLock } = req.body
            await lockUserAccount(currentUser, userToLock);
            res.status(200).json({ message: "Khóa tài khoản thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
