"use client"

import { GlobalContext } from "@/contexts"
import React, { useContext, useMemo, useState, useEffect } from "react"
import { LoadingActionWallet } from "../../loader"
import { useForm } from "react-hook-form"
import CustomModal from "../Modal"
import Button from "../../form/Button"
import { toast } from "react-toastify"
import useSWR, { mutate } from "swr"
import Input from "../../form/Input"
import { yupResolver } from "@hookform/resolvers/yup"
import { ManageStoreData, OptionStore, RegisterFormData } from "@/types"
import { registerSchema } from "@/utils/schema"
import { useRegisterModal } from "@/hooks/useUser"
import { customStyles, registerInputs } from "@/utils/constants"
import { registerService } from "@/services/user.service"
import Select from 'react-select'
import axiosInstance from "@/libs/axios"

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const ModalRegister = () => {
    const { setIsLoadingModal, isLoadingModal, store, user } = useContext(GlobalContext) || {}
    const [storeData, setStoreData] = useState<OptionStore | null>(null)
    const [roleData, setRoleData] = useState<OptionStore | null>(null)

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema)
    })

    const registerModal = useRegisterModal()

    const { data } = useSWR<ManageStoreData[]>(`/store`, fetcher)

    const optionStore = useMemo(() => {
        return data?.map(store => ({ id: store._id, value: store.name, label: store.name })) || []
    }, [data])

    const handleStoreChange = (newValue: OptionStore | null) => {
        setStoreData(newValue)
    }

    const optionRole = [
        { id: "1", value: "manage", label: "Quản lý" },
        { id: "2", value: "staff", label: "Nhân viên" }
    ]

    const handleRoleChange = (newValue: OptionStore | null) => {
        setRoleData(newValue)
    }

    useEffect(() => {
        if (user) {
            if (user.role === 'manage') {
                setRoleData(optionRole.find(role => role.value === 'staff') || null);
                setStoreData(optionStore.find(store => store.id === user.store) || null);
            }
        }
    }, [user, setRoleData, optionStore]);

    const onSubmit = async (data: RegisterFormData) => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (!storeData || !roleData) {
            if (!storeData) {
                setError("storeId", { message: "Cửa hàng không được để trống" })
            }

            if (!roleData) {
                setError("role", { message: "Chức vụ không được để trống" })
            }

            if (setIsLoadingModal) setIsLoadingModal(false)
            return
        }

        if (user) {
            const res = await registerService({
                email: data.email,
                username: data.username,
                password: data.password,
                phone: data.phone,
                storeId: storeData.id,
                role: roleData.value,
                createdBy: user._id
            })

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success("Cấp tài khoản thành công", {
                position: "top-right"
            })

            reset()
            mutate(!store ? '/user' : `/user/getByStore?storeId=${store.id}`)
            registerModal.onClose()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={registerModal.isOpen}
            onClose={registerModal.onClose}
            width="md:w-1/3 w-full"
            height="h-fit"
        >
            <form className="flex flex-col md:px-10 pb-5 gap-5 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Cấp tài khoản
                </div>
                <div className="flex flex-col gap-5 w-full">
                    {registerInputs.map((input) => (
                        <React.Fragment key={input.id}>
                            <Input
                                id={input.id}
                                name={input.name}
                                label={input.label}
                                placeholder={input.placeholder}
                                type={input.type}
                                register={register}
                                errors={errors}
                                colorInput="border border-black border-opacity-10 bg-transparent placeholder-black focus:border-opacity-30 focus:border focus:border-black focus:outline-none"
                            />
                        </React.Fragment>
                    ))}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-base font-semibold text-black text-left">
                            Chọn chức vụ:
                        </label>
                        <div className="text-left">
                            <Select
                                name="role"
                                options={user?.role === "manage" ? optionRole.filter(role => role.value === "staff") : optionRole}
                                styles={customStyles}
                                instanceId="listRole"
                                placeholder="Chọn chức vụ"
                                onChange={handleRoleChange}
                                value={roleData}
                                isDisabled={user?.role === "manage"}
                            />
                        </div>
                        {errors.role && (
                            <p className="text-red-500 font-medium h-2 text-left">
                                {errors.role?.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-base font-semibold text-black text-left">
                            Chọn chi nhánh:
                        </label>
                        <div className="text-left">
                            <Select
                                name="store"
                                options={user?.role === "manage" ? optionStore.filter(store => store.id === user.store) : optionStore}
                                styles={customStyles}
                                instanceId="listStore"
                                placeholder="Chọn chi nhánh"
                                onChange={handleStoreChange}
                                value={storeData}
                                isDisabled={user?.role === "manage"}
                            />
                        </div>
                        {errors.storeId && (
                            <p className="text-red-500 font-medium h-2 text-left">
                                {errors.storeId?.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-row gap-5 pt-5">
                    <Button
                        title="Không"
                        color="border-primary-blue-cus bg-white"
                        text="text-primary-blue-cus"
                        style="py-3 px-8"
                        onClick={registerModal.onClose}
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

export default ModalRegister
