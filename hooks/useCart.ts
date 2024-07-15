import { create } from 'zustand';

interface CartModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCartModal = create<CartModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
})) 