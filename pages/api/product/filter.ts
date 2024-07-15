import { getFilteredProducts, IProductFilter } from '@/libs/databases/controllers/ProductController';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const filter: IProductFilter = {
                storeId: req.query.storeId as string,
                supplierId: req.query.supplierId as string,
            };

            const products = await getFilteredProducts(filter);
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
};
