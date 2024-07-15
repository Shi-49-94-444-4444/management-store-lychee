"use client"

import { GlobalContext } from "@/contexts"
import { useContext } from "react"
import { LoadingActionWallet } from "../../loader"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { toast } from "react-toastify"
import { mutate } from "swr"
import { useBlockUserModal } from "@/hooks/useUser"
import { blockUserService } from "@/services/user.service"

const ModalBlock = () => {
    const { setIsLoadingModal, isLoadingModal, store, user } = useContext(GlobalContext) || {}

    const blockModal = useBlockUserModal()

    const handleDeleteStock = async () => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (blockModal.userId && user) {
            const res = await blockUserService(user._id, blockModal.userId)

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success("Khóa tài khoản thành công", {
                position: "top-right"
            })

            mutate(!store ? '/user' : `/user/getByStore?storeId=${store.id}`)
            blockModal.onClose()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={blockModal.isOpen}
            onClose={blockModal.onClose}
            width="md:w-auto w-full"
            height="h-auto"
        >
            <form className="flex flex-col md:px-5 pb-5 gap-5 justify-center items-center">
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Bạn có chắc chắn muốn khóa tài khoản này không?
                </div>
                <div className="flex flex-row gap-5">
                    <Button
                        title="Không"
                        color="border-primary-blue-cus bg-white"
                        text="text-primary-blue-cus"
                        style="py-3 px-8"
                        onClick={blockModal.onClose}
                    />
                    <Button
                        title="Có"
                        isHover={false}
                        style="py-3 px-8"
                        onClick={handleDeleteStock}
                    />
                </div>
            </form>
        </CustomModal>
    )
}

export default ModalBlock