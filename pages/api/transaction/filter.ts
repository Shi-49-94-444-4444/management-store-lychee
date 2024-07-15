import { FilterParams, getFilteredWalletHistory } from '@/libs/databases/controllers/TransactionController';
import { NextApiRequest, NextApiResponse } from 'next';

const walletHistoryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const filter: FilterParams = {
                storeId: req.query.storeId as string,
                startDate: new Date(req.query.startDate as string),
                endDate: new Date(req.query.endDate as string),
            };

            const history = await getFilteredWalletHistory(filter);

            return res.status(200).json(history);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
};

export default walletHistoryHandler;
