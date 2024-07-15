"use client"

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts"
import useSWR from "swr";
import ReactPaginate from "react-paginate"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { formatCurrency, formatShortTime, removeVietnameseTones } from "@/utils/format";
import axiosInstance from "@/libs/axios";
import { LoadingFadeSmall, LoadingFullScreen } from "./providers/loader";
import Search from "./providers/form/Search";
import { BsBookmarksFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi"
import { ManageStoreData } from "@/types";


interface TableHomeProps {
    listItem: ManagementHomeData[],
    currentPage: number,
    itemsPerPage: number,
}

interface ManagementHomeData {
    _id: string
    createdAt: string,
    action: string,
    totalPrice: number,
    isDelete: boolean,
}

const listTitleManagement = [
    { title: "#" },
    { title: "Mã giao dịch" },
    { title: "Thời gian" },
    { title: "Thao tác" },
    { title: "Trạng thái" },
    { title: "Số tiền" },
]

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data)

const TableHome: React.FC<TableHomeProps> = ({ listItem, currentPage, itemsPerPage }) => {
    const startIndex = currentPage * itemsPerPage

    return (
        <table className="table-auto border-separate border border-black border-opacity-10 rounded-lg text-sm sm:text-base md:text-lg text-gray-600 text-center table">
            <thead>
                <tr>
                    {listTitleManagement.map((item, index) => (
                        <th className={`
                                font-semibold 
                                py-3 
                                md:whitespace-nowrap
                                px-1
                                ${index < listTitleManagement.length - 1 ?
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
                {listItem.map((item, index) => {
                    const totalIndex = startIndex + index + 1

                    return (
                        <tr key={index}>
                            <td className="py-3 border-r border-black border-opacity-10">{totalIndex}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{item._id}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatShortTime(item.createdAt)}</td>
                            <td className="py-3 border-r border-black border-opacity-10">Thanh toán</td>
                            <td className="py-3 border-r border-black border-opacity-10">
                                {item.isDelete ? (
                                    <span className="text-red-500 font-semibold">Thất Bại</span>
                                ) : (
                                    <span className="text-green-500 font-semibold">Thành Công</span>
                                )}
                            </td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

const HomeManagement = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [dateRange, setDateRange] = useState({
        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    })
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalTransactionPrice, setTotalTransactionPrice] = useState<number>(0);

    const { store } = useContext(GlobalContext) || {}

    const { data: listIncoming, error, isLoading } = useSWR<ManagementHomeData[]>(dateRange.endDate && dateRange.startDate ? `/transaction/filter?storeId=${store ? store.id : ""}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : null, fetcher)
    const { data: listGlobal, error: errorGlobal, isLoading: loadingGlobal } = useSWR<ManageStoreData[] | ManageStoreData>(!store ? '/store' : `/store/${store.id}`, fetcher, { refreshInterval: 1000 })

    const filteredIncoming = listIncoming && listIncoming.filter(item => item.createdAt && removeVietnameseTones(item.createdAt).includes(removeVietnameseTones(searchTerm)))
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 10
    const pageCount = Math.ceil(filteredIncoming ? filteredIncoming.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = filteredIncoming && filteredIncoming.length > 0 ? filteredIncoming.slice(startIndex, endIndex) : []

    useEffect(() => {
        if (listGlobal) {
            if (Array.isArray(listGlobal)) {
                const usersCount = listGlobal.reduce((acc, storeData) => acc + storeData.users.length, 0);
                const productsCount = listGlobal.reduce((acc, storeData) => acc + storeData.products.length, 0);
                const quantitySum = listGlobal.reduce((acc, storeData) => acc + storeData.products.reduce((acc, product) => acc + product.totalStock, 0), 0);
                const transactionTotal = listGlobal.reduce((acc, storeData) => {
                    const transactionsTotal = storeData.transactions.reduce((acc, transaction) => {
                        if (!transaction.isDelete) {
                            acc += transaction.totalPrice;
                        }
                        return acc;
                    }, 0);
                    return acc + transactionsTotal;
                }, 0);

                setTotalUsers(usersCount);
                setTotalProducts(productsCount);
                setTotalQuantity(quantitySum);
                setTotalTransactionPrice(transactionTotal);
            } else {
                const usersCount = listGlobal.users.length ?? 0;
                const productsCount = listGlobal.products.length ?? 0;
                const quantitySum = listGlobal.products.reduce((acc: number, product: any) => acc + product.totalStock, 0);
                const transactionTotal = listGlobal.transactions.reduce((acc: number, transaction: any) => {
                    if (!transaction.isDelete) {
                        acc += transaction.totalPrice;
                    }
                    return acc;
                }, 0);
                setTotalUsers(usersCount);
                setTotalProducts(productsCount);
                setTotalQuantity(quantitySum);
                setTotalTransactionPrice(transactionTotal);
            }
        }
    }, [listGlobal]);


    return (
        <section className="relative flex flex-col px-6 py-10 gap-5">
            <div className="
                    flex 
                    flex-col 
                    text-gray-600 
                    gap-5
                    md:flex-row 
                    md:justify-between 
                    md:items-center 
                    md:gap-0
                    transition-all
                    duration-500
                "
            >
                <h1 className="font-semibold md:text-4xl text-3xl flex-shrink-0">
                    Quản lý tổng
                </h1>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-5">
                <div className="col-span-1 border border-black border-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="flex xl:flex-row flex-col gap-5 py-3 px-5 items-center justify-around">
                        <div className="relative text-primary-cus flex-shrink-0">
                            <IoWalletOutline size={60} />
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            {loadingGlobal ? (
                                <div className="relative w-full h-full justify-center items-center">
                                    <LoadingFadeSmall loading={loadingGlobal} />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-semibold text-primary-cus">
                                        {formatCurrency(totalTransactionPrice)}
                                    </div>
                                    <div className="text-xl font-semibold text-gray-600">
                                        Doanh thu
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-1 border border-black border-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="flex xl:flex-row flex-col gap-5 py-3 px-5 items-center justify-around">
                        <div className="relative text-primary-cus flex-shrink-0">
                            <GiReceiveMoney size={60} />
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            {loadingGlobal ? (
                                <div className="relative w-full h-full justify-center items-center">
                                    <LoadingFadeSmall loading={loadingGlobal} />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-semibold text-primary-cus">
                                        {totalProducts}
                                    </div>
                                    <div className="text-xl font-semibold text-gray-600">
                                        Mặt hàng
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-1 border border-black border-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="flex xl:flex-row flex-col gap-5 py-3 px-5 items-center justify-around">
                        <div className="relative text-primary-cus flex-shrink-0">
                            <BsBookmarksFill size={60} />
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            {loadingGlobal ? (
                                <div className="relative w-full h-full justify-center items-center">
                                    <LoadingFadeSmall loading={loadingGlobal} />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-semibold text-primary-cus">
                                        {totalQuantity} kg
                                    </div>
                                    <div className="text-xl font-semibold text-gray-600">
                                        Số lượng
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-1 border border-black border-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="flex xl:flex-row flex-col gap-5 py-3 px-5 items-center justify-around">
                        <div className="relative text-primary-cus flex-shrink-0">
                            <FaUserFriends size={60} />
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            {loadingGlobal ? (
                                <div className="relative w-full h-full justify-center items-center">
                                    <LoadingFadeSmall loading={loadingGlobal} />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-semibold text-primary-cus">
                                        {totalUsers}
                                    </div>
                                    <div className="text-xl font-semibold text-gray-600">
                                        Nhân viên
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="
                    flex 
                    flex-col 
                    text-gray-600 
                    gap-5
                    md:flex-row 
                    md:justify-between 
                    md:items-center 
                    md:gap-0
                    transition-all
                    duration-500
                "
            >
                <h1 className="font-semibold md:text-3xl text-2xl flex-shrink-0">
                    Tổng doanh thu trong tháng
                </h1>
                <div className="flex gap-3 flex-col md:flex-row transition-all duration-500 flex-wrap justify-end">
                    <div className="flex flex-col space-y-1 md:w-auto w-full transition-all duration-500">
                        <Search value={searchTerm} onChange={setSearchTerm} style="w-full" />
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                    <LoadingFullScreen loading={isLoading} />
                </div>
            ) : !listIncoming || !filteredIncoming || listIncoming.length === 0 ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-cus font-semibold h-96">
                    Không có doanh thu nào tồn tại
                </div>
            ) : error ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-cus font-semibold h-96">
                    Lỗi API
                </div>
            ) : filteredIncoming && filteredIncoming.length === 0 ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-cus font-semibold h-96">
                    Doanh thu trong khoản này không tồn tại
                </div>
            ) : (
                <>
                    <TableHome listItem={visibleItems} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                    {pageCount > 0 && (
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
        </section>
    )
}

export default HomeManagement