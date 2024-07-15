export interface LoginFormData {
    email: string 
    password: string 
}

export interface TableUserProps {
    listUser: ManageUserData[],
    currentPage: number,
    itemsPerPage: number,
}

export interface ManageUserData {
    _id: string
    email: string
    username: string
    phone: string
    role: string
    store?: {
        name: string
    }
    isLocked: boolean
}

export interface RegisterForm {
    email: string
    username: string
    password: string
    phone: string
    role: string
    storeId: string
    createdBy: string
}

export interface RegisterFormData {
    email: string
    username: string
    password: string
    phone: string
    confirmPassword: string 
    role?: string
    storeId?: string
}

export interface RegisterInput {
    email: string;
    username: string;
    password: string;
    phone: string;
    role: 'admin' | 'manage' | 'staff';
    storeId?: string;
    createdBy: string;
}