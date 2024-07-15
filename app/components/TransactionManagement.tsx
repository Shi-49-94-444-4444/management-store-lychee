"use client"

import { TransactionDetail } from "@/types/transaction";
import { formatCurrency, formatShortTime } from "@/utils/format";
import useSWR from "swr";
import Image from "next/image";
import { validateURLProduct } from "@/utils/validData";
import { useContext, useState } from "react";
import ReactPaginate from "react-paginate";
import axiosInstance from "@/libs/axios";
import { LoadingFullScreen } from "./providers/loader";
import { GlobalContext } from "@/contexts";

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const TransactionManagement = () => {
    const [expandedTransactions, setExpandedTransactions] = useState<{ [key: string]: boolean }>({});
    const { store } = useContext(GlobalContext) || {}

    const { data: listTransaction, error, isLoading } = useSWR<TransactionDetail[]>(`/transaction/getAll?storeId=${store ? store.id : ""}`, fetcher)

    const getTotalQuantity = (transaction: TransactionDetail): number => {
        return transaction.products.reduce((total, item) => total + item.quantity, 0);
    };

    const toggleDropdown = (transactionId: string) => {
        setExpandedTransactions({
            ...expandedTransactions,
            [transactionId]: !expandedTransactions[transactionId]
        });
    };

    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 5
    const pageCount = Math.ceil(listTransaction ? listTransaction.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = listTransaction && listTransaction.length > 0 ? listTransaction.slice(startIndex, endIndex) : []

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
                <h1 className="font-semibold md:text-4xl text-3xl flex-shrink-0">
                    Quản lý giao dịch
                </h1>
            </div>
            {isLoading ? (
                <div className="h-screen flex items-center justify-center">
                    <LoadingFullScreen loading={isLoading} />
                </div>
            ) : !listTransaction || listTransaction.length === 0 ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                    Không có đơn hàng nào tồn tại
                </div>
            ) : error ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                    Lỗi API
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {visibleItems.map((transaction) => (
                        <section key={transaction._id}>
                            <div className="relative rounded-md border border-black border-opacity-10 w-full">
                                <div className="flex flex-col gap-2 p-4 w-full">
                                    <div className="flex flex-row justify-between">
                                        <div className="text-2xl font-semibold">
                                            Mã đơn hàng: {transaction._id}
                                        </div>
                                        {!transaction.isDelete ? (
                                            <div className="text-lg font-semibold text-green-500">
                                                Thành công
                                            </div>
                                        ) : (
                                            <div className="text-lg font-semibold text-red-500">
                                                Thất bại
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="col-span-1 flex flex-col gap-2 border-r border-opacity-10">
                                            <div className="text-lg font-semibold">
                                                Người xử lý giao dịch:
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-md">
                                                <div className="col-span-1">
                                                    Tài khoản: {transaction.user.email}
                                                </div>
                                                <div className="col-span-1">
                                                    Tên: {transaction.user.username}
                                                </div>
                                                <div className="col-span-1">
                                                    Số điện thoại: {transaction.user.phone}
                                                </div>
                                                <div className="col-span-1">
                                                    Chi nhánh: {transaction.store.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex flex-col gap-2">
                                            <div className="text-lg font-semibold">
                                                Thông tin đơn hàng:
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-md">
                                                <div className="col-span-1">
                                                    Tổng số sản phẩm: {transaction.products.length}
                                                </div>
                                                <div className="col-span-1">
                                                    Tổng số lượng: {getTotalQuantity(transaction)}
                                                </div>
                                                <div className="col-span-1">
                                                    Tổng tiền: {transaction.totalPrice}
                                                </div>
                                                <div className="col-span-1">
                                                    Ngày đặt đơn: {formatShortTime(transaction.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-between mt-5">
                                        <div className="flex justify-start">
                                            <button className="bg-primary-cus text-white hover:bg-red-500 w-fit px-4 py-2 rounded-md text-lg font-semibold" onClick={() => toggleDropdown(transaction._id)}>
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {expandedTransactions[transaction._id] && (
                                <div className="mt-5 relative">
                                    <section className="grid grid-cols-12 gap-2 text-gray-500 py-3 px-8 rounded-sm shadow-sm border-b border-black border-opacity-10">
                                        <div className="col-span-5">
                                            Sản Phẩm
                                        </div>
                                        <div className="col-span-2 text-center">
                                            Đơn Giá
                                        </div>
                                        <div className="col-span-2 text-center">
                                            Số Lượng
                                        </div>
                                        <div className="col-span-2 text-center">
                                            Số Tiền
                                        </div>
                                    </section>
                                    {transaction.products.map((product) => (
                                        <div className="grid grid-cols-12 gap-2 items-center p-4 border-b border-black border-opacity-10" key={product.product._id}>
                                            <div className="col-span-5">
                                                <div className="w-full flex flex-row gap-2 items-start">
                                                    <div className="relative flex-shrink-0 w-32 h-32">
                                                        <Image
                                                            src={validateURLProduct(product.product.imageUrl)}
                                                            alt="product"
                                                            className="w-32 h-32 object-cover"
                                                            width={128}
                                                            height={128}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="text-xl hover:text-primary-cus">
                                                            {product.product.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                {formatCurrency(product.product.price ? product.product.price : 0)}
                                            </div>
                                            <div className="col-span-2 text-center">
                                                {product.quantity}
                                            </div>
                                            <div className="col-span-2 text-center text-primary-cus text-xl font-semibold">
                                                {formatCurrency(product.product.price ? (product.product.price * product.quantity) : 0)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
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
                </div>
            )}
        </div>
    )
}

export default TransactionManagement