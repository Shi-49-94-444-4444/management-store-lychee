import { create } from 'zustand';

interface AddStockModalStore {
    isOpen: boolean;
    productId: string | null;
    onOpen: (productId: string) => void;
    onClose: () => void;
}

interface StockModalStore {
    isOpen: boolean;
    stockId: string | null;
    productId: string | null;
    onOpen: (stockId: string, productId: string) => void;
    onClose: () => void;
}

export const useAddStockModal = create<AddStockModalStore>((set) => ({
    isOpen: false,
    productId: null,
    onOpen: (productId) => set({ isOpen: true, productId }),
    onClose: () => set({ isOpen: false, productId: null })
}))

export const useDeleteStockModal = create<StockModalStore>((set) => ({
    isOpen: false,
    stockId: null,
    productId: null,
    onOpen: (stockId, productId) => set({ isOpen: true, stockId, productId }),
    onClose: () => set({ isOpen: false, stockId: null, productId: null })
}))

export const useTransferModal = create<StockModalStore>((set) => ({
    isOpen: false,
    stockId: null,
    productId: null,
    onOpen: (stockId, productId) => set({ isOpen: true, stockId, productId }),
    onClose: () => set({ isOpen: false, stockId: null, productId: null })
}))

