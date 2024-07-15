import { getAllSupplier } from '@/libs/databases/controllers/SupplierControllet';
import connectDB from '@/libs/databases/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const suppliers = await getAllSupplier();
      res.status(200).json(suppliers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Phương thức không đúng' });
  }
}