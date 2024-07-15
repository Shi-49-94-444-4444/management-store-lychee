"use client"

import { GlobalContext } from "@/contexts";
import axiosInstance from "@/libs/axios";
import { ManageStoreData, OptionsOverviewProps, OptionStore } from "@/types"
import { customStyles, roleAdmin } from "@/utils/constants";
import { useContext, useMemo } from "react";
import Select from 'react-select'
import useSWR from "swr";

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const AdminOverview: React.FC<OptionsOverviewProps> = ({
    options,
    onOptionSelect,
    selectedOption
}) => {
    const selectOptions = options.map(option => ({
        value: option.id,
        label: option.label,
        icon: option.icon,
    }))

    const { user, setStore, store } = useContext(GlobalContext) || {}

    const handleChange = (selectedOption: any) => {
        onOptionSelect(selectedOption.value);
    }

    const { data } = useSWR<ManageStoreData[]>(`/store`, fetcher)

    const optionStore = useMemo(() => {
        return data?.map(store => ({ id: store._id, value: store.name, label: store.name })) || []
    }, [data])

    const handleStoreChange = (newValue: OptionStore | null) => {
        if (setStore) {
            setStore(newValue)
        }
    }

    const userStore = user && user.store
        ? data && data.find(store => store._id === user.store)
        : null;

    return (
        <div className="
                flex 
                flex-col 
                border 
                border-black 
                border-opacity-10 
                rounded-r-xl 
                bg-white 
                px-6 
                h-full
                gap-5
                py-5
                lg:py-10 
                lg:gap-10 
            "
        >
            <div className="
                    relative
                    flex
                    flex-row
                    justify-between
                    items-center
                    lg:flex-col 
                    lg:justify-normal
                    lg:items-baseline
                "
            >
                <div className="text-gray-600 font-semibold text-xl text-wrap">
                    {user && user.username}
                </div>
                <div className="text-lg font-semibold italic text-gray-500">
                    {user && user.role}
                </div>
            </div>
            <div className="w-full">
                {user && user.role === roleAdmin ? (
                    <Select
                        name="store"
                        options={optionStore}
                        styles={customStyles}
                        instanceId="listStore"
                        placeholder="Chọn chi nhánh"
                        onChange={handleStoreChange}
                        value={store}
                        isClearable
                    />
                ) : (
                    <div className="text-lg font-semibold">
                        Chi nhánh: {userStore?.name}
                    </div>
                )}
            </div>
            <div className="border-b border-black border-opacity-10" />
            <div className="
                    lg:flex
                    lg:flex-col
                    lg:gap-10
                    hidden
                "
            >
                {options.map((option) => (
                    <button className={`
                            relative 
                            flex 
                            flex-row 
                            items-center 
                            space-x-2 
                            cursor-pointer 
                            hover:text-primary-cus 
                            text-gray-600
                            ${selectedOption === option.id ? 'text-primary-cus font-semibold' : ''}
                        `}
                        key={option.id}
                        onClick={() => onOptionSelect(option.id)}
                    >
                        <div className="flex-shrink-0">
                            <option.icon size={24} />
                        </div>
                        <p className="text-lg font-medium text-left">
                            {option.label}
                        </p>
                    </button>
                ))}
            </div>
            <div className="lg:hidden block">
                <Select
                    options={selectOptions}
                    onChange={handleChange}
                    instanceId="listOption"
                    isSearchable={false}
                    value={selectOptions.find(option => option.value === selectedOption)}
                    styles={customStyles}
                />
            </div>
        </div>
    )
}

export default AdminOverview