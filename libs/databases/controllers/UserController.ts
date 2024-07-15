import { RegisterInput } from '@/types';
import Store from '../models/Store';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export const loginUser = async (email: string, password: string): Promise<{ user: IUser, token: string }> => {
    try {
        if (!email || !password) {
            throw new Error('Email hoặc mật khẩu không được để trống');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email hoặc mật khẩu sai');
        }

        if (user.isLocked) {
            throw new Error('Tài khoản của bạn đã bị khóa');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Email hoặc mật khẩu sai');
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('Token sai');
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        
        return { user, token };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const lockUserAccount = async (currentUserId: string, userIdToLock: string): Promise<IUser> => {
    try {
        const currentUser = await User.findById(currentUserId);
        const userToLock = await User.findById(userIdToLock);
        
        if (!currentUser) {
            throw new Error('Người dùng hiện tại không tồn tại');
        }
        
        if (!userToLock) {
            throw new Error('Người dùng cần khóa không tồn tại');
        }
        
        if (currentUserId === userIdToLock) {
            throw new Error('Không thể khóa tài khoản của chính mình');
        }

        // Admin can lock manage and staff
        if (currentUser.role === 'admin' && (userToLock.role === 'manage' || userToLock.role === 'staff')) {
            userToLock.isLocked = true;
            await userToLock.save();
            return userToLock;
        }

        // Manage can lock staff
        if (currentUser.role === 'manage' && userToLock.role === 'staff') {
            userToLock.isLocked = true;
            await userToLock.save();
            return userToLock;
        }

        throw new Error('Không có quyền khóa tài khoản người dùng này');
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Admin
export const getAllUsers = async (): Promise<IUser[]> => {
    try {
        const users = await User.find().populate('store', 'name');
        return users;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Staff & Manage
export const getUsersByStore = async (storeId: string): Promise<IUser[]> => {
    try {
        const users = await User.find({ store: storeId }).populate('store', 'name');
        return users;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const register = async (input: RegisterInput): Promise<IUser> => {
    const { email, username, password, phone, role, storeId, createdBy } = input;

    // Validate creator's role
    const creator = await User.findById(createdBy);
    if (!creator) {
        throw new Error('Người cấp tài khoản không hợp lệ');
    }

    if (creator.role === 'staff') {
        throw new Error('Nhân viên không có quyền cấp tài khoản');
    }

    if (creator.role === 'manage' && role !== 'staff') {
        throw new Error('Quản lý chỉ có quyền cấp tài khoản cho nhân viên');
    }

    if (role === 'manage') {
        const store = await Store.findById(storeId);
        if (!store) {
            throw new Error('Cửa hàng không hợp lệ');
        }

        const manageExists = await User.findOne({ store: storeId, role: 'manage' });
        if (manageExists) {
            throw new Error('Mỗi cửa hàng chỉ được cấp một tài khoản quản lý');
        }
    }

    if (role !== 'admin' && !storeId) {
        throw new Error('Tài khoản này phải thuộc một cửa hàng');
    }

    const newUser = new User({
        email,
        username,
        password,
        phone,
        role,
        store: role !== 'admin' ? storeId : undefined,
        createdBy,
    });

    await newUser.save();

    if (role !== 'admin' && storeId) {
        await Store.findByIdAndUpdate(storeId, {
            $push: { users: newUser._id }
        });
    }
    
    return newUser;
};