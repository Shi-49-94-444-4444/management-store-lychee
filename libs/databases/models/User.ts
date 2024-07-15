import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    phone: string;
    role: 'admin' | 'manage' | 'staff';
    store?: mongoose.Types.ObjectId;
    isLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manage', 'staff'] },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: function (this: IUser) { return this.role !== 'admin'; } },
    isLocked: { type: Boolean, default: false, required: function (this: IUser) { return this.role !== 'admin'; } },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function (this: IUser) { return this.role !== 'admin'; } },
});

UserSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
