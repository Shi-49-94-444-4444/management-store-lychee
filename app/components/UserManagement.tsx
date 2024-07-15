"use client"

import { useContext, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import ReactPaginate from "react-paginate"
import { ManageUserData, TableUserProps } from "@/types"
import useSWR from "swr"
import { useOutsideClick } from "@/utils/functions/outSideClickHandler";
import Search from "./providers/form/Search"
import axiosInstance from "@/libs/axios"
import { LoadingFullScreen } from "./providers/loader"
import { removeVietnameseTones } from "@/utils/format"
import { GlobalContext } from "@/contexts"
import { roleAdmin, roleManage } from "@/utils/constants"
import Button from "./providers/form/Button"
import { IoMdAdd } from "react-icons/io"
import { useBlockUserModal, useRegisterModal } from "@/hooks/useUser"

const listTitleUserManagement = [
    { title: "#" },
    { title: "Email" },
    { title: "Họ và tên" },
    { title: "Số điện thoại" },
    { title: "Chi nhánh" },
    { title: "Chức vụ" },
    { title: "Trạng thái" },
    { title: "Thao tác" },
]

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const TableUser: React.FC<TableUserProps> = ({ listUser, currentPage, itemsPerPage }) => {
    const [showToggleItemID, setShowToggleItemID] = useState<number | null>(null)
    const blockModal = useBlockUserModal()
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
        { title: "Khóa tài khoản", src: (userId: string) => blockModal.onOpen(userId) },
    ]

    return (
        <table className="table-auto border-separate border border-black border-opacity-10 rounded-lg text-sm sm:text-base md:text-lg text-gray-600 text-center table">
            <thead>
                <tr>
                    {listTitleUserManagement.map((item, index) => (
                        <th className={`
                                font-semibold 
                                py-3 
                                md:whitespace-nowrap
                                px-1
                                ${index < listTitleUserManagement.length - 1 ?
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
                {listUser.map((user, index) => {
                    const totalIndex = startIndex + index + 1

                    return (
                        <tr key={index}>
                            <td className="py-3 border-r border-black border-opacity-10">{totalIndex}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{user.email}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{user.username}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{user.phone}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{user.store?.name}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{user.role === roleAdmin ? "admin" : user.role === roleManage ? "Quản lý" : "Nhân viên"}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{user?.isLocked ? "Đã khóa" : "Bình thường"}</td>
                            <td className="py-3 relative">
                                <button className=" cursor-pointer" type="button" onClick={() => handleToggle(index)}>
                                    ...
                                </button>
                                {showToggleItemID === index && (
                                    <div className="absolute right-[15rem] md:right-[17rem] lg:right-[18rem] sm:bottom-4 bottom-5 bg-gray-100 shadow-md rounded-lg w-auto translate-x-full translate-y-full transition p-2 z-[1001] text-left whitespace-nowrap" ref={ref}>
                                        <ul className="space-y-2 list-none">
                                            {listAction.map((action, index) => (
                                                <li className="hover:bg-slate-200 hover:text-primary-blue-cus p-2 cursor-pointer" key={index}>
                                                    <button type="button" onClick={() => action.src(user._id)}>
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

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const { store, user } = useContext(GlobalContext) || {}
    const registerModal = useRegisterModal()

    const { data: listManageUser, error, isLoading } = useSWR<ManageUserData[]>(!store ? '/user' : `/user/getByStore?storeId=${store.id}`, fetcher)

    const filteredUsers = listManageUser && listManageUser.filter(user => user.username && removeVietnameseTones(user.username).includes(removeVietnameseTones(searchTerm)))

    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 13
    const pageCount = Math.ceil(filteredUsers ? filteredUsers.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = filteredUsers && filteredUsers.length > 0 ? filteredUsers.slice(startIndex, endIndex) : []

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
                        Quản lý nhân viên
                    </h1>
                    <div className="flex gap-3 flex-col md:flex-row justify-end flex-wrap transition-all duration-500">
                        <div className="flex flex-col space-y-1 md:w-auto w-full transition-all duration-500">
                            <Search value={searchTerm} onChange={setSearchTerm} style="w-full" />
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="h-screen flex items-center justify-center">
                        <LoadingFullScreen loading={isLoading} />
                    </div>
                ) : !listManageUser || !filteredUsers || listManageUser.length === 0 ? (
                    <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                        Không có người dùng nào tồn tại
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                        Lỗi API
                    </div>
                ) : filteredUsers && filteredUsers.length === 0 ? (
                    <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                        Người dùng này không tồn tại
                    </div>
                ) : (
                    <>
                        <TableUser listUser={visibleItems} currentPage={currentPage} itemsPerPage={itemsPerPage} />
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
            {(user?.role === roleAdmin || user?.role === roleManage) && (
                <section className="fixed bottom-5 right-5">
                    <Button
                        title="Cấp tài khoản"
                        iconLeft={<IoMdAdd size={30} />}
                        style="px-4 py-3"
                        onClick={() => registerModal.onOpen()}
                    />
                </section>
            )}
        </>
    )
}

export default UserManagement