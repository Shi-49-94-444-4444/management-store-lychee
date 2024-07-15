import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
    name: string;
    users: mongoose.Types.ObjectId[];
    products: mongoose.Types.ObjectId[];
    transactions: mongoose.Types.ObjectId[];
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const StoreSchema: Schema<IStore> = new Schema({
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Store = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);

export default Store;
