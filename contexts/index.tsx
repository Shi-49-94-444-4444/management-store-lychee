"use client"

import React, { FC, createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { OptionStore, Product } from '@/types'

interface GlobalStateProps {
    children: React.ReactNode
}

interface User {
    _id: string
    email?: string | null
    phone?: string | null
    username?: string | null
    role?: string | null
    store?: string | null
}

export interface Cart {
    product: Product
    quantity: number
}

interface GlobalContextProps {
    isAuthUser: boolean | null
    setIsAuthUser: React.Dispatch<React.SetStateAction<boolean | null>>
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    isLoading: boolean | null
    setIsLoading: React.Dispatch<React.SetStateAction<boolean | null>>
    isLoadingModal: boolean | null
    setIsLoadingModal: React.Dispatch<React.SetStateAction<boolean | null>>
    isLoadingPage: boolean | null
    setIsLoadingPage: React.Dispatch<React.SetStateAction<boolean | null>>
    isRefresh: boolean | null
    setIsRefresh: React.Dispatch<React.SetStateAction<boolean | null>>
    fetchUser: boolean | null
    setFetchUser: React.Dispatch<React.SetStateAction<boolean | null>>
    searchValue: string | null
    setSearchValue: React.Dispatch<React.SetStateAction<string | null>>
    store: OptionStore | null
    setStore: React.Dispatch<React.SetStateAction<OptionStore | null>>
    cart: Cart[] | null
    setCart: React.Dispatch<React.SetStateAction<Cart[] | null>>
}

export const GlobalContext = createContext<GlobalContextProps | null>(null);

const GlobalState: FC<GlobalStateProps> = ({ children }) => {
    const [isAuthUser, setIsAuthUser] = useState<boolean | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(false)
    const [isLoadingModal, setIsLoadingModal] = useState<boolean | null>(false)
    const [isLoadingPage, setIsLoadingPage] = useState<boolean | null>(false)
    const [isRefresh, setIsRefresh] = useState<boolean | null>(false)
    const [fetchUser, setFetchUser] = useState<boolean | null>(false)
    const [searchValue, setSearchValue] = useState<string | null>("")
    const [store, setStore] = useState<OptionStore | null>(null)
    const [cart, setCart] = useState<Cart[] | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (Cookies.get('token') !== undefined) {
            setIsAuthUser(true)
            const userData = JSON.parse(localStorage.getItem('user')!) || {}
            setUser(userData)
            if (setStore && userData.store) {
                setStore({ id: userData.store, label: "", value: "" })
            }
        } else {
            setIsAuthUser(false)
            setUser(null)
        }
    }, [])

    useEffect(() => {
        if (isRefresh) {
            router.reload()
            setIsRefresh(false)
        }
    }, [isRefresh, router])

    return (
        <GlobalContext.Provider
            value={{
                isAuthUser,
                setIsAuthUser,
                user,
                setUser,
                isLoading,
                setIsLoading,
                isLoadingPage,
                setIsLoadingPage,
                searchValue,
                setSearchValue,
                isLoadingModal,
                setIsLoadingModal,
                isRefresh,
                setIsRefresh,
                fetchUser,
                setFetchUser,
                store,
                setStore,
                cart,
                setCart
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalState;