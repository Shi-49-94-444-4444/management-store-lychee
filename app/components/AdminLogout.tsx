"use client"

import { GlobalContext } from "@/contexts"
import { useContext } from "react"
import { ImExit } from "react-icons/im"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

const AdminLogout = () => {
    const router = useRouter()

    const { setUser, setIsAuthUser, setIsRefresh } = useContext(GlobalContext) || {}

    const handleBack = async () => {
        if (setUser && setIsAuthUser) {
            setUser(null)
            setIsAuthUser(false)
        }
        Cookies.remove("token")
        localStorage.clear()
        router.push("/").then(() => {
            if (setIsRefresh) {
                setIsRefresh(true)
            }
        })
    }

    return (
        <div className="
                border 
                border-black 
                border-opacity-10 
                rounded-t-xl 
                rounded-l-none 
                bg-white 
                text-gray-600 
                hover:text-primary-blue-cus 
                mt-auto
                lg:flex-none
                flex
                items-start
            "
        >
            <button className="flex flex-row space-x-2 p-6 lg:items-center cursor-pointer hover:text-primary-cus" type="button" onClick={handleBack}>
                <div className="flex-shrink-0">
                    <ImExit size={24} />
                </div>
                <p className="text-lg font-medium">
                    Đăng Xuất
                </p>
            </button>
        </div>
    )
}

export default AdminLogout