"use client"

import ReactPaginate from "react-paginate"
import { useOutsideClick } from "@/utils/functions/outSideClickHandler";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useSWR from "swr";
import { formatNoTime, formatShortTime } from "@/utils/format";
import { IoMdArrowRoundBack } from "react-icons/io"
import { FaPlus } from "react-icons/fa";
import axiosInstance from "@/libs/axios";
import { ManageStockData, TableStockProps } from "@/types/stock";
import { Product } from "@/types";
import { LoadingFullScreen } from "./providers/loader";
import { statusNearExpiry, statusNormal } from "@/utils/constants";
import { useAddStockModal, useDeleteStockModal, useTransferModal } from "@/hooks/useStock";
import Context from "./providers/Context";

const listTitleDetailProductManagement = [
    { title: "#" },
    { title: "Số lượng" },
    { title: "Ngày sản xuất" },
    { title: "Hạn sử dụng" },
    { title: "Ngày nhập kho" },
    { title: "Lần cập nhật cuối" },
    { title: "Trạng thái" },
    { title: "Lựa chọn" },
]

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const TableProduct: React.FC<TableStockProps> = ({ listStock, currentPage, itemsPerPage }) => {
    const [showToggleItemID, setShowToggleItemID] = useState<number | null>(null)
    const deleteStockModal = useDeleteStockModal()
    const transferModal = useTransferModal()

    const startIndex = currentPage * itemsPerPage

    const handleToggle = (itemID: number) => {
        if (showToggleItemID === itemID) {
            setShowToggleItemID(null)
        } else {
            setShowToggleItemID(itemID)
        }
    }

    const handleOutsideClick = () => {
        setShowToggleItemID(null)
    }

    const ref = useRef<HTMLDivElement | null>(null)
    useOutsideClick(ref, handleOutsideClick)

    const listAction = [
        { title: "Xóa kho hàng", src: (stockId: string, productId: string) => { deleteStockModal.onOpen(stockId, productId) } },
        { title: "Chuyển kho hàng", src: (stockId: string, productId: string) => { transferModal.onOpen(stockId, productId) } },
    ]

    return (
        <table className="table-auto border-separate border border-black border-opacity-10 rounded-lg text-sm sm:text-base md:text-lg text-gray-600 text-center table">
            <thead>
                <tr>
                    {listTitleDetailProductManagement.map((item, index) => (
                        <th className={`
                                font-semibold 
                                py-3 
                                md:whitespace-nowrap
                                px-1
                                ${index < listTitleDetailProductManagement.length - 1 ?
                                "border-r border-b border-black border-opacity-10" :
                                "border-b"
                            }`}
                            key={index}
                        >
                            {item.title}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-base font-medium">
                {listStock.map((stock, index) => {
                    const totalIndex = startIndex + index + 1

                    return (
                        <tr key={index}>
                            <td className="py-3 border-r border-black border-opacity-10">{totalIndex}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{stock.quantity} kg</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatNoTime(stock.productionDate)}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatNoTime(stock.expiryAt)}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatShortTime(stock.createdAt)}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatShortTime(stock.updatedAt)}</td>
                            <td className="py-3 border-r border-black border-opacity-10">
                                {stock.status === statusNormal ? (
                                    <span className="font-semibold text-green-500">
                                        Bình thường
                                    </span>
                                ) : stock.status === statusNearExpiry ? (
                                    <span className="font-semibold text-primary-cus">
                                        Sắp hết hạn
                                    </span>
                                ) : (
                                    <span className="font-semibold text-red-500">
                                        Đã hết hạn
                                    </span>
                                )}
                            </td>
                            <td className="py-3 relative">
                                <button className=" cursor-pointer" type="button" onClick={() => handleToggle(index)}>
                                    ...
                                </button>
                                {showToggleItemID === index && (
                                    <div className="absolute right-[15rem] md:right-[17rem] lg:right-[15rem] sm:bottom-4 bottom-3 bg-gray-100 shadow-md rounded-lg w-auto translate-x-full translate-y-full transition p-2 z-[1001] text-left whitespace-nowrap" ref={ref}>
                                        <ul className="space-y-2 list-none">
                                            {listAction.map((action, index) => (
                                                <li className="hover:bg-slate-200 hover:text-primary-blue-cus p-2 cursor-pointer" key={index}>
                                                    <button type="button" onClick={() => action.src(stock._id, stock.product._id)}>
                                                        {action.title}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

const DetailProduct = () => {
    const router = useRouter()

    const addStockModal = useAddStockModal()

    const { id } = router.query

    const { data: listManagementStock, error, isLoading } = useSWR<ManageStockData[]>(id ? `/stock/${id}` : null, fetcher, { refreshInterval: 1000 })
    const { data: Product, error: errorProduct, isLoading: loadingProduct } = useSWR<Product>(`/product/${id}`, fetcher);

    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 13
    const pageCount = Math.ceil(listManagementStock ? listManagementStock.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = listManagementStock && listManagementStock.length > 0 ? listManagementStock.slice(startIndex, endIndex) : []

    return (
        <div className="relative flex flex-col px-6 py-10">
            <div className="
                    flex 
                    flex-col 
                    text-primary-cus
                    gap-5
                    pb-10
                    md:flex-row 
                    md:justify-between 
                    md:items-center 
                    md:gap-0
                "
            >
                <div className="
                        flex 
                        text-primary-cus
                        pb-5
                        space-x-3
                        font-semibold
                        items-center
                    "
                >
                    <button className="relative" type="button" onClick={() => router.back()}>
                        <IoMdArrowRoundBack size={40} />
                    </button>
                    <h1 className="font-semibold md:text-4xl text-3xl flex-shrink-0">
                        {Product?.name}
                    </h1>
                </div>
                <div className="flex gap-3 flex-col md:flex-row justify-end flex-wrap transition-all duration-500">
                    <button className="w-fit flex flex-row gap-2 text-lg items-center justify-center p-2 font-semibold bg-white border border-primary-cus rounded-md text-primary-cus hover:text-white hover:bg-primary-cus" onClick={() => { if (id) addStockModal.onOpen(id.toString()) }}>
                        <span>
                            <FaPlus size={30} />
                        </span>
                        <span>
                            Thêm kho hàng
                        </span>
                    </button>
                </div>
            </div>
            <Context />
            {(isLoading || loadingProduct) ? (
                <div className="h-screen flex items-center justify-center">
                    <LoadingFullScreen loading={(isLoading || loadingProduct)} />
                </div>
            ) : !listManagementStock || listManagementStock.length === 0 ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                    Không có hàng tồn kho
                </div>
            ) : (error || errorProduct) ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                    Lỗi API
                </div>
            ) : (
                <>
                    <TableProduct listStock={visibleItems} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                    {pageCount > 1 && (
                        <div className="flex justify-center mt-10 text-base font-semibold">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={4}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageChange}
                                containerClassName="pagination flex p-0 m-0"
                                activeClassName="text-gray-400 bg-gray-200"
                                previousLabel="<"
                                nextLabel=">"
                                pageClassName="border-2 px-4 py-2"
                                previousClassName="border-2 px-4 py-2"
                                nextClassName="border-2 px-4 py-2"
                                pageLinkClassName="pagination-link"
                                nextLinkClassName="pagination-link"
                                breakClassName="pagination-items border-2 px-3 py-2"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default DetailProduct