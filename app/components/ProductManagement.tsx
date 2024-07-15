"use client"

import ReactPaginate from "react-paginate"
import { useOutsideClick } from "@/utils/functions/outSideClickHandler";
import { useRouter } from "next/router";
import { useContext, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { formatShortTime, removeVietnameseTones } from "@/utils/format";
import { ManageProductData, OptionStore, TableProductProps } from "@/types";
import { IoMdAdd } from "react-icons/io";
import Search from "./providers/form/Search";
import axiosInstance from "@/libs/axios";
import { LoadingFullScreen } from "./providers/loader";
import Button from "./providers/form/Button";
import { GlobalContext } from "@/contexts";
import { SupplierDetail } from "@/types/supplier";
import { customStyles } from "@/utils/constants";
import Select from "react-select"
import { useDeleteProductModal } from "@/hooks/useProduct";
import { useAddStockModal } from "@/hooks/useStock";

const listTitleProductManagement = [
    { title: "#" },
    { title: "Tên mặt hàng" },
    { title: "Tổng số lượng" },
    { title: "Đã bán" },
    { title: "Nhà cung cấp" },
    { title: "Chi nhánh" },
    { title: "Lần cập nhật cuối" },
    { title: "Lựa chọn" },
]

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);
const [supplierData, setSupplierData] = useState<OptionStore | null>(null)

const TableProduct: React.FC<TableProductProps> = ({ listProduct, currentPage, itemsPerPage }) => {
    const [showToggleItemID, setShowToggleItemID] = useState<number | null>(null)
    const deleteProductModal = useDeleteProductModal()
    const addStockModal = useAddStockModal()
    const router = useRouter()
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
        { title: "Xem chi tiết sản phẩm", src: (productId: string) => router.push(`/detail-product-management/${productId}`) },
        { title: "Xóa sản phẩm", src: (productId: string) => deleteProductModal.onOpen(productId, supplierData) },
        { title: "Thêm kho hàng", src: (productId: string) => addStockModal.onOpen(productId) },
    ]

    return (
        <table className="table-auto border-separate border border-black border-opacity-10 rounded-lg text-sm sm:text-base md:text-lg text-gray-600 text-center table">
            <thead>
                <tr>
                    {listTitleProductManagement.map((item, index) => (
                        <th className={`
                                font-semibold 
                                py-3 
                                md:whitespace-nowrap
                                px-1
                                ${index < listTitleProductManagement.length - 1 ?
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
                {listProduct.map((product, index) => {
                    const totalIndex = startIndex + index + 1

                    return (
                        <tr key={index}>
                            <td className="py-3 border-r border-black border-opacity-10">{totalIndex}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{product.name}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{product.totalStock} kg</td>
                            <td className="py-3 border-r border-black border-opacity-10">{product.sale}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{product.supplier.name}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{product.store.name}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatShortTime(product.updatedAt)}</td>
                            <td className="py-3 relative">
                                <button className=" cursor-pointer" type="button" onClick={() => handleToggle(index)}>
                                    ...
                                </button>
                                {showToggleItemID === index && (
                                    <div className="absolute right-[15rem] md:right-[17rem] lg:right-[18rem] sm:bottom-4 bottom-5 bg-gray-100 shadow-md rounded-lg w-auto translate-x-full translate-y-full transition p-2 z-[1001] text-left whitespace-nowrap" ref={ref}>
                                        <ul className="space-y-2 list-none">
                                            {listAction.map((action, index) => (
                                                <li className="hover:bg-slate-200 hover:text-primary-blue-cus p-2 cursor-pointer" key={index}>
                                                    <button type="button" onClick={() => action.src(product._id)}>
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

const ProductManagement = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>("")

    const { store } = useContext(GlobalContext) || {}

    const { data: listManageProduct, error, isLoading } = useSWR<ManageProductData[]>(`/product/filter?storeId=${store ? store.id : ""}&supplierId=${supplierData ? supplierData.id : ""}`, fetcher)
    const { data: Suppliers } = useSWR<SupplierDetail[]>(`/supplier`, fetcher)

    const optionSupplier = useMemo(() => {
        return Suppliers?.map(supplier => ({ id: supplier._id, value: supplier.name, label: supplier.name })) || []
    }, [Suppliers])

    const handleSupplierChange = (newValue: OptionStore | null) => {
        setSupplierData(newValue)
    }

    const filteredProducts = listManageProduct && listManageProduct.filter(product => product.name && removeVietnameseTones(product.name).includes(removeVietnameseTones(searchTerm)))

    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 13
    const pageCount = Math.ceil(filteredProducts ? filteredProducts.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = filteredProducts && filteredProducts.length > 0 ? filteredProducts.slice(startIndex, endIndex) : []

    return (
        <>
            <section className="relative flex flex-col px-6 py-10">
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
                        Quản lý sản phẩm
                    </h1>
                    <div className="flex gap-3 flex-col md:flex-row justify-end flex-wrap transition-all duration-500">
                        <div className="w-64">
                            <Select
                                name="supplier"
                                options={optionSupplier}
                                styles={customStyles}
                                instanceId="listSupplier"
                                placeholder="Chọn nhà cung cấp"
                                onChange={handleSupplierChange}
                                value={supplierData}
                                isClearable
                            />
                        </div>
                        <div className="flex flex-col space-y-1 md:w-auto w-full transition-all duration-500">
                            <Search value={searchTerm} onChange={setSearchTerm} style="w-full" />
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="h-screen flex items-center justify-center">
                        <LoadingFullScreen loading={isLoading} />
                    </div>
                ) : !listManageProduct || !filteredProducts || listManageProduct.length === 0 ? (
                    <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                        Không có sản phẩm nào tồn tại
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                        Lỗi API
                    </div>
                ) : filteredProducts && filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                        Sản phẩm này không tồn tại
                    </div>
                ) : (
                    <>
                        <TableProduct listProduct={visibleItems} currentPage={currentPage} itemsPerPage={itemsPerPage} />
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
            </section>
            <div className="fixed bottom-5 right-5">
                <Button
                    title="Đăng sản phẩm"
                    iconLeft={<IoMdAdd size={30} />}
                    style="px-4 py-3"
                    onClick={() => router.push("/post-product")}
                />
            </div>
        </>
    )
}

export default ProductManagement