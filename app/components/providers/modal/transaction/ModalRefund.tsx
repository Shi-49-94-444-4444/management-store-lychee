"use client"

import { GlobalContext } from "@/contexts"
import { useContext } from "react"
import { LoadingActionWallet } from "../../loader"
import { useForm } from "react-hook-form"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { toast } from "react-toastify"
import Input from "../../form/Input"
import { yupResolver } from "@hookform/resolvers/yup"
import { refundSchema } from "@/utils/schema"
import { Refund } from "@/types"
import { useRefundModal } from "@/hooks/useTransaction"
import { refundTransactionService } from "@/services/transaction.service"
import { mutate } from "swr"

const ModalRefund = () => {
    const { setIsLoadingModal, isLoadingModal, user, store } = useContext(GlobalContext) || {}

    const { register, handleSubmit, formState: { errors }, reset } = useForm<Refund>({
        resolver: yupResolver(refundSchema)
    })

    const refundModal = useRefundModal()

    const onSubmit = async (data: Refund) => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (refundModal.transactionId && user) {
            const res = await refundTransactionService(refundModal.transactionId, user._id, data.price, data.reason)

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success("Hoàn trả đơn hàng thành công", {
                position: "top-right"
            })

            reset()
            mutate(`/transaction/getAll?storeId=${store ? store.id : ""}`)
            refundModal.onClose()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={refundModal.isOpen}
            onClose={refundModal.onClose}
            width="md:w-1/3 w-full"
            height="h-fit"
        >
            <form className="flex flex-col md:px-10 pb-5 gap-5 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Hoàn trả đơn hàng
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Lý do:
                    </label>
                    <Input
                        colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                        id="reason"
                        name="reason"
                        type="string"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Số tiền:
                    </label>
                    <Input
                        colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                        id="price"
                        name="price"
                        type="number"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="flex flex-row gap-5">
                    <Button
                        title="Không"
                        color="border-primary-blue-cus bg-white"
                        text="text-primary-blue-cus"
                        style="py-3 px-8"
                        onClick={refundModal.onClose}
                    />
                    <Button
                        title="Có"
                        isHover={false}
                        style="py-3 px-8"
                        type="submit"
                    />
                </div>
            </form>
        </CustomModal>
    )
}

export default ModalRefund