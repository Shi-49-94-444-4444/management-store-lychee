export interface TableProductProps {
    listProduct: ManageProductData[],
    currentPage: number,
    itemsPerPage: number,
}

export interface ManageProductData {
    _id: string
    name: string
    totalStock: number
    sale: string
    supplier: {
        name: string
    }
    store: {
        name: string
    }
    updatedAt: string
}

export interface CreateProductInput {
    name: string,
    price: number,
    description: string,
    supplierName: string,
    imageUrl: string,
    storeId: string,
    userId: string
}

export interface ProductFormData {
    name: string;
    price: number;
    description: string;
    supplier?: string;
    imageUrl?: string;
    storeId?: string;
    userId?: string;
}

export interface Product {
    _id: string;
    name?: string;
    price?: number;
    description?: string;
    supplier?: {
        name: string
    };
    imageUrl?: string;
    totalStock: number;
    stocks?: {
        _id: string;
        quantity: number
        expiryAt: string;
    }[];
    sale: number;
}