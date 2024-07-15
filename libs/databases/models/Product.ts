import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    supplier: mongoose.Types.ObjectId;
    store: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    imageUrl: string;
    stocks: mongoose.Types.ObjectId[];
    totalStock: number;
    sale: number;
    isDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }],
    totalStock: { type: Number, default: 0 },
    sale: { type: Number, default: 0 },
    isDelete: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
