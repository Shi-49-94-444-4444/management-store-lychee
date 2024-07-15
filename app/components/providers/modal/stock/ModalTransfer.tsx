"use client"

import { GlobalContext } from "@/contexts"
import { useContext, useMemo, useState } from "react"
import { LoadingActionWallet } from "../../loader"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { toast } from "react-toastify"
import useSWR, { mutate } from "swr"
import { useTransferModal } from "@/hooks/useStock"
import { transferService } from "@/services/stock.service"
import axiosInstance from "@/libs/axios"
import { ManageStoreData, OptionStore } from "@/types"
import Select from 'react-select'
import { customStyles } from "@/utils/constants"
import { useForm } from "react-hook-form"
import { TransferStock } from "@/types/stock"
import { yupResolver } from "@hookform/resolvers/yup"
import Input from "../../form/Input"
import { transferSchema } from "@/utils/schema"

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const ModalTransfer = () => {
    const { setIsLoadingModal, isLoadingModal, user } = useContext(GlobalContext) || {}
    const [storeData, setStoreData] = useState<OptionStore | null>(null)

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<TransferStock>({
        resolver: yupResolver(transferSchema)
    })

    const transferModal = useTransferModal()

    const { data } = useSWR<ManageStoreData[]>(`/store`, fetcher)

    const optionStore = useMemo(() => {
        return data?.map(store => ({ id: store._id, value: store.name, label: store.name })) || []
    }, [data])

    const handleStoreChange = (newValue: OptionStore | null) => {
        setStoreData(newValue)
    }

    const handleTransferStock = async (data: TransferStock) => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (!storeData) {
            setError("store", { message: "Chi nhánh không được bỏ trống" })
            if (setIsLoadingModal) setIsLoadingModal(false)
            return
        }

        if (transferModal.stockId && user) {
            const res = await transferService(transferModal.stockId, data.quantity, storeData.id, user._id)

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success("Chuyển kho hàng thành công", {
                position: "top-right"
            })

            mutate(`/stock/${transferModal.productId}`)
            reset()
            transferModal.onClose()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={transferModal.isOpen}
            onClose={transferModal.onClose}
            width="md:w-1/3 w-full"
            height="h-auto"
        >
            <form className="flex flex-col md:px-5 pb-5 gap-5 justify-center items-center" onSubmit={handleSubmit(handleTransferStock)}>
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Chuyển kho hàng
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <Input
                        id="quantity"
                        name="quantity"
                        label="Nhập số lượng"
                        placeholder="Nhập số lượng muốn chuyển"
                        type="number"
                        register={register}
                        errors={errors}
                        colorInput="border border-black border-opacity-10 bg-transparent placeholder-black focus:border-opacity-30 focus:border focus:border-black focus:outline-none"
                    />
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-base font-semibold text-black text-left">
                            Chọn chi nhánh:
                        </label>
                        <div className="text-left">
                            <Select
                                name="store"
                                options={optionStore}
                                styles={customStyles}
                                instanceId="listStore"
                                placeholder="Chọn chi nhánh"
                                onChange={handleStoreChange}
                                value={storeData}
                            />
                        </div>
                        {errors.store && (
                            <p className="text-red-500 font-medium h-2 text-left">
                                {errors.store?.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-row gap-5">
                    <Button
                        title="Không"
                        color="border-primary-blue-cus bg-white"
                        text="text-primary-blue-cus"
                        style="py-3 px-8"
                        onClick={transferModal.onClose}
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

export default ModalTransfer