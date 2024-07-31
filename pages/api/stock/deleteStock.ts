import { deleteStock } from '@/libs/databases/controllers/StockController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const { stockId, userId } = req.query;
            await deleteStock(stockId as string, userId as string);
            res.status(200).json({ data: 'Success', message: 'Xóa kho hàng thành công' });
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
