import { postProduct } from '@/libs/databases/controllers/ProductController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { name, price, description, supplierName, imageUrl, storeId, userId } = req.body;
            const product = await postProduct({ name, price, description, supplierName, imageUrl, storeId, userId });
            res.status(200).json({ data: product, message: 'Thêm mặt hàng thành công' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
