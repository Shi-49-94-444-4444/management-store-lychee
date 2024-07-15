"use client"

import '@/styles/globals.css'
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AdminOverview from './components/AdminOverview';
import AdminLogout from './components/AdminLogout';
import { adminOptions, manageOptions, roleAdmin, roleManage, staffOptions } from '@/utils/constants';
import { GlobalContext } from '@/contexts';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [selectedOption, setSelectedOption] = useState<number>(1)
    const router = useRouter()

    const { user } = useContext(GlobalContext) || {}

    const isAdmin = user && user.role === roleAdmin
    const isManage = user && user.role === roleManage

    const options = isAdmin ? adminOptions : isManage ? manageOptions : staffOptions

    useEffect(() => {
        options.forEach((option) => {
            if (router.pathname === option.case) {
                setSelectedOption(option.id);
            }
        });
    }, [router.pathname, options]);

    const handleOptionSelect = (id: number) => {
        setSelectedOption(id);
        const selectedOption = options.find(option => option.id === id);
        if (selectedOption) {
            router.push(selectedOption.case);
        }
    };

    return (
        <div className="relative bg-[#F7F7F7]">
            <div className="
                    relative 
                    gap-5
                    flex
                    flex-col
                    lg:grid 
                    lg:grid-cols-6 
                "
            >
                <div className="
                        lg:col-span-1 
                        lg:min-h-screen 
                        lg:max-h-full 
                        lg:flex 
                        lg:flex-col 
                        lg:gap-5 
                    "
                >
                    <AdminOverview
                        options={options}
                        selectedOption={selectedOption}
                        onOptionSelect={handleOptionSelect}
                    />
                    <AdminLogout />
                </div>
                <div className="
                        lg:col-span-5 
                        min-h-screen 
                        max-h-full 
                        flex 
                        flex-col 
                        gap-5 
                        border 
                        border-black 
                        border-opacity-10 
                        bg-white rounded-xl
                    "
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
