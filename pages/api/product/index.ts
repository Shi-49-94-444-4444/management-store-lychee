import { getAllProducts } from '@/libs/databases/controllers/ProductController';
import { updateStockStatus } from '@/libs/databases/controllers/StockController';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await getAllProducts();
      await updateStockStatus()
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Phương thức không đúng' });
  }
}