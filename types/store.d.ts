export interface TableStoreProps {
    listStore: ManageUserData[],
    currentPage: number,
    itemsPerPage: number,
}

export interface ManageStoreData {
    _id: string
    name: string
    users: {
        _id: string
    }[]
    products: {
        totalStock: number
    }[]
    transactions: {
        totalPrice: number,
        isDelete: boolean
    }[]
    address: string
}

export interface StoreAdd {
    name: string
    address: string
}

interface OptionStore {
    id: string;
    value: string;
    label: string
}