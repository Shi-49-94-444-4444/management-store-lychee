import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IStock extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
  productionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  expiryAt: Date;
  price: number; // new attribute
  isDelete: 'active' | 'received' | 'returned'; // updated attribute
  status: 'normal' | 'near expiry' | 'expired';
  user: mongoose.Types.ObjectId;
}

const StockSchema: Schema<IStock> = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  productionDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiryAt: { type: Date, required: true },
  price: { type: Number, required: true }, // new field
  isDelete: {
    type: String,
    enum: ['active', 'received', 'returned'],
    default: 'active'
  },
  status: {
    type: String,
    enum: ['normal', 'near expiry', 'expired'],
    default: 'normal'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

StockSchema.pre<IStock>('save', function (next) {
  const now = new Date();
  const expiryThreshold = new Date(this.expiryAt);
  expiryThreshold.setDate(expiryThreshold.getDate() - 1);

  if (now > this.expiryAt) {
    this.status = 'expired';
  } else if (now > expiryThreshold) {
    this.status = 'near expiry';
  } else {
    this.status = 'normal';
  }

  next();
});

StockSchema.post('save', async function (stock) {
  const Product = mongoose.model<IProduct>('Product');

  const totalStockQuery = await Stock.aggregate([
    {
      $match: {
        $or: [
          { product: stock.product },
          { product: stock.product._id }
        ],
        isDelete: { $in: ['active', 'received'] },
        status: { $in: ['normal', 'near expiry'] }
      }
    },
    { $group: { _id: '$product', total: { $sum: '$quantity' } } }
  ]);

  let totalStock = 0;
  if (totalStockQuery.length > 0) {
    totalStock = totalStockQuery[0].total;
  }

  await Product.findByIdAndUpdate(stock.product, {
    totalStock: totalStock
  });
});

const Stock = mongoose.models.Stock as mongoose.Model<IStock> || mongoose.model<IStock>('Stock', StockSchema);

export default Stock;
