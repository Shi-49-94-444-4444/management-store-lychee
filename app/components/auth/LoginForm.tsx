"use client"

import { useRouter } from "next/router"
import Input from "../providers/form/Input"
import React, { useContext, useEffect } from "react"
import { GlobalContext } from "@/contexts"
import { useForm } from "react-hook-form"
import { LoginFormData } from "@/types"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from 'react-toastify'
import { Loading } from "../providers/loader"
import Cookies from 'js-cookie'
import { loginInputs } from "@/utils/constants"
import { loginSchema } from "@/utils/schema"
import { loginService } from "@/services/login.service"

const LoginForm = () => {
    const {
        isAuthUser,
        setIsAuthUser,
        setUser,
        setIsLoading,
        isLoading,
        setStore
    } = useContext(GlobalContext) || {}

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        if (setIsLoading) setIsLoading(true)

        const res = await loginService(data)

        if (res.data == null) {
            toast.error(res.message, {
                position: "top-right",
            })
            if (setIsLoading) setIsLoading(false)
            return
        }

        toast.success(res.message, {
            position: "top-right",
        })

        if (setIsAuthUser && setUser) {
            setIsAuthUser(true)
            const user = res.data
            setUser(user)
            if (setStore && user.store) {
                setStore({ id: user.store, label: "", value: "" })
            }
        }

        Cookies.set("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.data))
        if (res.data.store) {
            localStorage.setItem("store", JSON.stringify(res.data.store))
        }
        localStorage.setItem("token", res.data.token)

        if (setIsLoading) setIsLoading(false)
    }

    useEffect(() => {
        if (isAuthUser) {
            router.push("/home")
        }

    }, [router, isAuthUser])

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="fixed w-1/4 h-fit bg-white bg-opacity-40 rounded-md backdrop-blur-sm">
                <div className="flex flex-col gap-8 p-10">
                    <label className="text-2xl font-semibold">Đăng nhập</label>
                    <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                        {loginInputs.map((input) => (
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
                        <div className="flex flex-col gap-2 pt-3">
                            {isLoading ? (
                                <button className="w-full text-center py-2 uppercase rounded-md text-lg text-white bg-primary-cus" type="submit">
                                    <Loading loading={isLoading} color="white" />
                                </button>
                            ) : (
                                <button className="w-full text-center py-2 uppercase rounded-md text-lg text-white bg-primary-cus hover:bg-red-400" type="submit">
                                    Đăng nhập
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm