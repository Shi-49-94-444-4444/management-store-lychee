import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  products: { product: mongoose.Types.ObjectId; quantity: number; stock: mongoose.Types.ObjectId }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDelete: { type: Boolean, required: true, default: false },
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
