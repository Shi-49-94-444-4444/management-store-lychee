import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/libs/databases/mongoose';
import { createRefundTransaction } from '@/libs/databases/controllers/TransactionController';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { originalTransactionId, refundingUserId, price, reason } = req.body;

        try {
            const result = await createRefundTransaction(originalTransactionId, refundingUserId, price, reason);

            return res.status(200).json({ data: result, message: "Hoàn tiền thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
