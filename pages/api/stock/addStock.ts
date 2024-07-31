import { addStockToProduct } from '@/libs/databases/controllers/StockController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { quantity, productId, productionDate, userId, price } = req.body;
            const newStock = await addStockToProduct(productId, quantity, productionDate, userId, price);
            res.status(200).json({ data: newStock, message: 'Thêm kho hàng thành công' });
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
