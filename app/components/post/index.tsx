"use client"

import ThumbGallery from "./ThumbsGallery"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "react-toastify"
import { GlobalContext } from "@/contexts"
import Input from "../providers/form/Input"
import Button from "../providers/form/Button"
import { Loading } from "../providers/loader"
import { postProductService } from "@/services/product.service"
import { ManageStoreData, OptionStore, ProductFormData } from "@/types"
import { postProductSchema } from "@/utils/schema"
import { customStyles, postProductInputs, roleManage, roleStaff } from "@/utils/constants"
import Select from "react-select"
import CreatableSelect from 'react-select/creatable';
import useSWR from "swr"
import axiosInstance from "@/libs/axios"
import { SupplierDetail } from "@/types/supplier"
import { useRouter } from "next/router"

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const PostNewForm = () => {
    const [uploadImage, setUploadImage] = useState<string>("")
    const [storeData, setStoreData] = useState<OptionStore | null>(null)
    const [supplierData, setSupplierData] = useState<OptionStore | null>(null)
    const router = useRouter()

    const {
        user,
        setIsLoading,
        isLoading,
        store
    } = useContext(GlobalContext) || {}

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError
    } = useForm<ProductFormData>({
        resolver: yupResolver(postProductSchema),
    })

    const { data } = useSWR<ManageStoreData[]>(`/store`, fetcher)
    const { data: Suppliers } = useSWR<SupplierDetail[]>(`/supplier`, fetcher)

    const optionStore = useMemo(() => {
        return data?.map(store => ({ id: store._id, value: store.name, label: store.name })) || []
    }, [data])

    const optionSupplier = useMemo(() => {
        return Suppliers?.map(supplier => ({ id: supplier._id, value: supplier.name, label: supplier.name })) || []
    }, [Suppliers])

    const handleStoreChange = (newValue: OptionStore | null) => {
        setStoreData(newValue)
    }

    const handleSupplierChange = (newValue: OptionStore | null) => {
        setSupplierData(newValue)
    }

    useEffect(() => {
        if (user && store) {
            if (user.role === roleStaff || user.role === roleManage) {
                const storeRes = optionStore.filter((value) => value.id === store.id)[0]
                setStoreData(storeRes)
            }
        }
    }, [setStoreData, user, store])

    const onSubmit = async (data: ProductFormData) => {
        if (setIsLoading) setIsLoading(true)

        if (!storeData || !supplierData || !uploadImage || uploadImage.trim() === "") {
            if (!uploadImage || uploadImage.trim() === "") {
                setError("imageUrl", { message: "Hình ảnh không được để trống" })
            }

            if (!storeData) {
                setError("storeId", { message: "Cửa hàng không được để trống" })
            }

            if (!supplierData) {
                setError("supplier", { message: "Nhà cung cấp không được để trống" })
            }

            if (setIsLoading) setIsLoading(false)
            return
        }

        if (user) {
            const res = await postProductService({
                name: data.name,
                price: data.price,
                description: data.description,
                imageUrl: uploadImage,
                storeId: storeData.id,
                supplierName: supplierData.value,
                userId: user._id
            })

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right",
                })
                if (setIsLoading) setIsLoading(false)
                return
            }

            toast.success("Thêm mặt hàng mới thành công", {
                position: "top-right",
            })

            reset()
            setUploadImage("")
            router.push("/product-management")
        }

        if (setIsLoading) setIsLoading(false)
    }

    return (
        <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center">
                <ThumbGallery setImage={setUploadImage} />
                {errors.imageUrl && (
                    <p className="text-red-500 font-medium h-2 text-left py-1">
                        {errors.imageUrl?.message}
                    </p>
                )}
            </div>
            <div className="relative px-40">
                <div className="flex flex-col gap-8">
                    {postProductInputs.map((input) => (
                        <React.Fragment key={input.id}>
                            <div className="grid grid-cols-4 gap-3 items-center">
                                <div className="col-span-1">
                                    <label className="text-lg font-semibold text-gray-600">{input.label}</label>
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        id={input.id}
                                        name={input.name}
                                        colorInput="bg-[#F5F5F5]"
                                        type={input.type}
                                        maxLength={100}
                                        register={register}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                    <div className="grid grid-cols-4 gap-3 items-center">
                        <div className="col-span-1">
                            <label className="text-lg font-semibold text-gray-600">Mô tả:</label>
                        </div>
                        <div className="col-span-3">
                            <Input
                                flagInput
                                id="description"
                                name="description"
                                colorInput="bg-[#F5F5F5]"
                                type="text"
                                maxLength={500}
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-center">
                        <div className="col-span-1">
                            <label className="text-lg font-semibold text-gray-600">
                                Chọn nhà cung cấp:
                            </label>
                        </div>
                        <div className="col-span-3 text-left">
                            <CreatableSelect
                                name="supplier"
                                options={optionSupplier}
                                styles={customStyles}
                                instanceId="listSupplier"
                                placeholder="Chọn nhà cung cấp"
                                onChange={handleSupplierChange}
                                value={supplierData}
                            />
                            {errors.supplier && (
                                <p className="text-red-500 font-medium h-2 text-left">
                                    {errors.supplier?.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-center">
                        <div className="col-span-1">
                            <label className="text-lg font-semibold text-gray-600">
                                Chọn chi nhánh:
                            </label>
                        </div>
                        <div className="col-span-3 text-left">
                            <Select
                                name="store"
                                options={optionStore}
                                styles={customStyles}
                                instanceId="listStore"
                                placeholder="Chọn chi nhánh"
                                onChange={handleStoreChange}
                                value={storeData}
                                isDisabled={user?.role === "manage" || user?.role === "staff"}
                            />
                            {errors.storeId && (
                                <p className="text-red-500 font-medium h-2 text-left">
                                    {errors.storeId?.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="py-4 flex justify-center">
                        {isLoading ? (
                            <Button
                                title={<Loading loading={isLoading} color="white" />}
                                style="px-16 py-3 text-xl"
                                type="submit"
                                isHover={false}
                            />
                        ) : (
                            <Button
                                title="Đăng bài"
                                style="px-16 py-3 text-xl"
                                type="submit"
                            />
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PostNewForm