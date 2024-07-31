import { create } from 'zustand';

interface RefundModalStore {
    isOpen: boolean;
    transactionId: string | null;
    onOpen: (transactionId: string) => void;
    onClose: () => void;
}

export const useRefundModal = create<RefundModalStore>((set) => ({
    isOpen: false,
    transactionId: null,
    onOpen: (transactionId) => set({ isOpen: true, transactionId }),
    onClose: () => set({ isOpen: false, transactionId: null })
}))