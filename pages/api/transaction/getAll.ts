import { getAllTransactions, ITransactionFilter } from '@/libs/databases/controllers/TransactionController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const filter: ITransactionFilter = {
                storeId: req.query.storeId as string,
            };
            
            const transactions = await getAllTransactions(filter);
            res.status(200).json(transactions);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
