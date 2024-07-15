import { create } from 'zustand';

interface BlockUserModalStore {
    isOpen: boolean;
    userId: string | null;
    onOpen: (userBlock: string) => void;
    onClose: () => void;
}

interface RegisterModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useBlockUserModal = create<BlockUserModalStore>((set) => ({
    isOpen: false,
    userId: null,
    onOpen: (userId) => set({ isOpen: true, userId }),
    onClose: () => set({ isOpen: false, userId: null })
}))

export const useRegisterModal = create<RegisterModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
})) 