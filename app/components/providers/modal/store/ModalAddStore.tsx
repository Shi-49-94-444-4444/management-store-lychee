"use client"

import { GlobalContext } from "@/contexts"
import { useContext } from "react"
import { LoadingActionWallet } from "../../loader"
import { useForm } from "react-hook-form"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { toast } from "react-toastify"
import { mutate } from "swr"
import Input from "../../form/Input"
import { yupResolver } from "@hookform/resolvers/yup"
import { StoreAdd } from "@/types"
import { storeAddSchema } from "@/utils/schema"
import { useAddStoreModal } from "@/hooks/useStore"
import { addStoreService } from "@/services/store.service"

const ModalAddStore = () => {
    const { setIsLoadingModal, isLoadingModal } = useContext(GlobalContext) || {}

    const { register, handleSubmit, formState: { errors }, reset } = useForm<StoreAdd>({
        resolver: yupResolver(storeAddSchema)
    })
    const addStoreModal = useAddStoreModal()

    const onSubmit = async (data: StoreAdd) => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        const res = await addStoreService(data.name, data.address)

        if (res.data == null) {
            toast.error(res.message, {
                position: "top-right"
            })
            if (setIsLoadingModal) setIsLoadingModal(false)
            return
        }

        toast.success("Thêm chi nhánh thành công", {
            position: "top-right"
        })

        reset()
        mutate("/store")
        addStoreModal.onClose()

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={addStoreModal.isOpen}
            onClose={addStoreModal.onClose}
            width="md:w-1/3 w-full"
            height="h-fit"
        >
            <form className="flex flex-col md:px-10 pb-5 gap-5 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Thêm Chi Nhánh
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Nhập tên chi nhánh:
                    </label>
                    <Input
                        colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                        id="name"
                        name="name"
                        type="text"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Nhập địa chỉ:
                    </label>
                    <Input
                        colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                        id="address"
                        name="address"
                        type="text"
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
                        onClick={addStoreModal.onClose}
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

export default ModalAddStore