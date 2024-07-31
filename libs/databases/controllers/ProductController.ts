import cloudinary from "@/libs/cloudinary";
import Product, { IProduct } from "../models/Product";
import Supplier from "../models/Supplier";
import { CreateProductInput } from "@/types";
import Store from "../models/Store";

export const getAllProducts = async (): Promise<IProduct[]> => {
    try {
        const products = await Product.find({ isDelete: false })
            .populate('supplier', 'name')
            .populate('store', 'name')
        return products;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getProductById = async (productId: string): Promise<IProduct | null> => {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const postProduct = async (input: CreateProductInput): Promise<IProduct | null> => {
    try {
        const { name, price, description, supplierName, imageUrl, storeId, userId } = input

        let supplier = await Supplier.findOne({ name: supplierName });

        if (!supplier) {
            supplier = new Supplier({ name: supplierName });
            await supplier.save();
        }

        const result = await cloudinary.uploader.upload(imageUrl, { folder: 'product-images/' });

        let product = await Product.findOne({ name: new RegExp(`^${name}$`, 'i'), supplier: supplier._id, store: storeId });

        if (product) {
            if (product.isDelete) {
                product.isDelete = false;
                product.price = price;
                product.description = description;
                product.supplier = supplier._id;
                product.store = storeId
                product.imageUrl = result.secure_url;
                product.user = userId;
            } else {
                throw new Error('Mặt hàng đã sớm tồn tại');
            }
        } else {
            product = new Product({
                ...input,
                supplier: supplier._id,
                imageUrl: result.secure_url,
                store: storeId,
                user: userId,
            });
        }

        await product.save();

        await Store.findByIdAndUpdate(storeId, {
            $push: { products: product._id }
        });

        return product
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export interface IProductFilter {
    storeId?: string
    supplierId?: string
}

export const getFilteredProducts = async (filter: IProductFilter): Promise<IProduct[]> => {
    try {
        const { storeId, supplierId } = filter;

        const query: any = { isDelete: false };

        if (storeId) {
            query['store'] = storeId;
        }

        if (supplierId) {
            query['supplier'] = supplierId;
        }

        const products = await Product.find(query)
            .populate('supplier', 'name')
            .populate('store', 'name')

        return products;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteProduct = async (productId: string): Promise<IProduct | null> => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { isDelete: true, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedProduct) {
            throw new Error('Sản phẩm không tồn tại');
        }

        return updatedProduct;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
