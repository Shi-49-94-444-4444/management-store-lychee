import { OptionStore } from '@/types';
import { create } from 'zustand';

interface ProductModalStore {
    isOpen: boolean;
    productId: string | null;
    supplierData: OptionStore | null;
    onOpen: (productId: string, supplierData: OptionStore | null) => void;
    onClose: () => void;
}

export const useDeleteProductModal = create<ProductModalStore>((set) => ({
    isOpen: false,
    productId: null,
    supplierData: null,
    onOpen: (productId, supplierData) => set({ isOpen: true, productId, supplierData }),
    onClose: () => set({ isOpen: false, productId: null, supplierData: null })
}))