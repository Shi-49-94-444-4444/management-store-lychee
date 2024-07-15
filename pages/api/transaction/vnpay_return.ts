import { removeTransaction, saveTransaction } from '@/libs/databases/controllers/TransactionController';
import connectDB from '@/libs/databases/mongoose';
import { vnpayVerifyPayment } from '@/libs/databases/services/vnpay';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const query = req.query;

        if (vnpayVerifyPayment(query)) {
            const transactionId = query.vnp_TxnRef as string;
            const vnp_ResponseCode = query.vnp_ResponseCode as string;
            try {
                if (vnp_ResponseCode === '00') {
                    await saveTransaction(transactionId);
                    res.redirect("/transaction/success")
                } else {
                    await removeTransaction(transactionId);
                    res.redirect("/transaction/failure")
                }
            } catch (error: any) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(400).json({ message: 'Xác nhận thanh toán thất bại' });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
