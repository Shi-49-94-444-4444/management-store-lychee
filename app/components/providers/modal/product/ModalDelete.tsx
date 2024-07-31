"use client"

import { GlobalContext } from "@/contexts"
import { useContext } from "react"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { LoadingActionWallet } from "../../loader"
import { toast } from "react-toastify"
import { mutate } from "swr"
import { useDeleteProductModal } from "@/hooks/useProduct"
import { deleteProductService } from "@/services/product.service"

const ModalDeleteProduct = () => {
    const deleteProductModal = useDeleteProductModal()
    const { setIsLoadingModal, isLoadingModal, store } = useContext(GlobalContext) || {}

    const handleDeleteProduct = async () => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (deleteProductModal.productId) {
            const res = await deleteProductService(deleteProductModal.productId)

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success(res.message, {
                position: "top-right"
            })

            mutate(`/product/filter?storeId=${store ? store.id : ""}&supplierId=${""}`)
            deleteProductModal.onClose()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={deleteProductModal.isOpen}
            onClose={deleteProductModal.onClose}
            width="md:w-auto w-full"
            height="h-auto"
        >
            <form className="flex flex-col md:px-10 pb-5 gap-5 justify-center items-center">
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Bạn có chắc chắn muốn xóa sản phẩm này không?
                </div>
                <div className="flex flex-row gap-5">
                    <Button
                        title="Không"
                        color="border-primary-blue-cus bg-white"
                        text="text-primary-blue-cus"
                        style="py-3 px-8"
                        onClick={deleteProductModal.onClose}
                    />
                    <Button
                        title="Có"
                        isHover={false}
                        style="py-3 px-8"
                        onClick={handleDeleteProduct}
                    />
                </div>
            </form>
        </CustomModal>
    )
}

export default ModalDeleteProduct