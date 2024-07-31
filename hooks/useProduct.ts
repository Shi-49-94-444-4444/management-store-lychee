import { create } from 'zustand';

interface ProductModalStore {
    isOpen: boolean;
    productId: string | null;
    onOpen: (productId: string) => void;
    onClose: () => void;
}

export const useDeleteProductModal = create<ProductModalStore>((set) => ({
    isOpen: false,
    productId: null,
    supplierData: null,
    onOpen: (productId) => set({ isOpen: true, productId }),
    onClose: () => set({ isOpen: false, productId: null })
}))