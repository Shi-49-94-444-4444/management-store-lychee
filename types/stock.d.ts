export interface StockAdd {
    quantity: number
}

export interface TableStockProps {
    listStock: ManageStockData[],
    currentPage: number,
    itemsPerPage: number,
}

export interface ManageStockData {
    _id: string
    product: {
        _id: string
        name: string
    }
    quantity: number
    productionDate: string
    expiryAt: string
    createdAt: string
    updatedAt: string
    isDelete: string
    status: string
}

export interface StockDetail {
    quantity: number
    expiryAt: string
}

export interface TransferStock {
    quantity: number
    store?: string
}