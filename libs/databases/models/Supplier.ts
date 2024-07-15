import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  createdAt: Date;
  isDelete: boolean;
}

const BrandSchema: Schema<ISupplier> = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isDelete: { type: Boolean, required: true, default: false },
})

const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', BrandSchema);

export default Supplier;
