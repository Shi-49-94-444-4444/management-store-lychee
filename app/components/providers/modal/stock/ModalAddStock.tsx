"use client"

import { GlobalContext } from "@/contexts"
import { useContext, useState } from "react"
import { LoadingActionWallet } from "../../loader"
import { useForm } from "react-hook-form"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { toast } from "react-toastify"
import { mutate } from "swr"
import Input from "../../form/Input"
import { StockAdd } from "@/types/stock"
import { yupResolver } from "@hookform/resolvers/yup"
import { stockAddSchema } from "@/utils/schema"
import { useAddStockModal } from "@/hooks/useStock"
import Datepicker from "react-tailwindcss-datepicker"
import { parse } from "date-fns"
import { addStockToProductService } from "@/services/stock.service"

const ModalAddStock = () => {
    const { setIsLoadingModal, isLoadingModal, user } = useContext(GlobalContext) || {}

    const { register, handleSubmit, formState: { errors }, reset } = useForm<StockAdd>({
        resolver: yupResolver(stockAddSchema)
    })

    const [selectedDate, setSelectedDate] = useState<{ startDate: Date, endDate: Date }>({
        startDate: new Date(),
        endDate: new Date()
    })

    const addStockModal = useAddStockModal()

    const onSubmit = async (data: StockAdd) => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (addStockModal.productId && user) {
            const res = await addStockToProductService(addStockModal.productId, data.quantity, selectedDate.startDate.toString(), user._id, data.price)

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success("Thêm kho hàng thành công", {
                position: "top-right"
            })

            reset()
            mutate(`/stock/${addStockModal.productId}`)
            addStockModal.onClose()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={addStockModal.isOpen}
            onClose={addStockModal.onClose}
            width="md:w-1/3 w-full"
            height="h-fit"
        >
            <form className="flex flex-col md:px-10 pb-5 gap-5 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Thêm vào kho hàng
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Nhập số lượng:
                    </label>
                    <Input
                        colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                        id="quantity"
                        name="quantity"
                        type="number"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Giá:
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
                <div className="flex flex-col gap-3 w-full">
                    <label className="text-gray-600 text-xl font-semibold text-left">
                        Ngày sản xuất:
                    </label>
                    <Datepicker
                        asSingle={true}
                        useRange={false}
                        i18n={"vi"}
                        value={selectedDate}
                        onChange={(NewDate: any) => {
                            const selectedDate = NewDate.startDate
                            if (selectedDate) {
                                const parsedDate = parse(selectedDate, 'yyyy-MM-dd', new Date())
                                if (parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && parsedDate <= new Date()) {
                                    setSelectedDate({ startDate: parsedDate, endDate: parsedDate })
                                } else {
                                    console.error('Invalid date')
                                    setSelectedDate({ startDate: new Date(), endDate: new Date() })
                                }
                            } else {
                                setSelectedDate({ startDate: new Date(), endDate: new Date() })
                            }
                        }}
                        popoverDirection="down"
                        primaryColor={"orange"}
                        displayFormat={"DD/MM/YYYY"}
                        inputClassName="light w-full bg-[#F5F5F5] border-none py-3 px-6 focus:ring-0 rounded-lg"
                        maxDate={new Date()}
                    />
                </div>
                <div className="flex flex-row gap-5">
                    <Button
                        title="Không"
                        color="border-primary-blue-cus bg-white"
                        text="text-primary-blue-cus"
                        style="py-3 px-8"
                        onClick={addStockModal.onClose}
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

export default ModalAddStock