import { NextApiRequest, NextApiResponse } from 'next';
import { createTransaction } from '@/libs/databases/controllers/TransactionController';
import connectDB from '@/libs/databases/mongoose';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, storeId, cart, paymentMethod } = req.body;

        try {
            const result = await createTransaction({ userId, storeId, cart, paymentMethod });

            if (paymentMethod) {
                return res.status(200).json({ data: result, message: "Tạo giao dịch thành công" });
            } else {
                return res.status(200).json({ data: result, message: "Thanh toán thành công" });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
