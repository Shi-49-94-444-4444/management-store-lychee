import { addStore } from '@/libs/databases/controllers/StoreController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, address } = req.body;
        try {
            const store = await addStore(name, address);

            res.status(200).json({ data: store, message: "Thêm chi nhánh thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
