import { updateStockStatus } from '@/libs/databases/controllers/StockController';
import { getById } from '@/libs/databases/controllers/StoreController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { storeId } = req.query

        try {
            const stores = await getById(storeId as string);
            await updateStockStatus()
            res.status(200).json(stores);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
