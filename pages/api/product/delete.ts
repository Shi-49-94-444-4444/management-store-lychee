import { deleteProduct } from '@/libs/databases/controllers/ProductController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { productId } = req.body
            const product = await deleteProduct(productId as string);
            res.status(200).json({ data: product, message: "Xóa thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
