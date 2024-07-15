"use client"

import { useContext, useState } from "react";
import { GlobalContext } from "@/contexts"
import useSWR from "swr";
import ReactPaginate from "react-paginate"
import Datepicker from "react-tailwindcss-datepicker"
import { endOfMonth, format, parse, parseISO, startOfMonth } from "date-fns"
import { Line, Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineController,
    LineElement,
    ArcElement,
    PieController,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineController,
    LineElement,
    ArcElement,
    PieController,
    Title,
    Tooltip,
    Legend
);
import { formatCurrency, formatShortTime, removeVietnameseTones } from "@/utils/format";
import axiosInstance from "@/libs/axios";
import { LoadingFullScreen } from "./providers/loader";
import Search from "./providers/form/Search";

interface TableReportProps {
    listItem: ManagementReportData[],
    currentPage: number,
    itemsPerPage: number,
}

interface ManagementReportData {
    _id: string
    createdAt: string,
    action: string,
    totalPrice: number,
    isDelete: boolean,
}

const listTitleManagement = [
    { title: "#" },
    { title: "Mã giao dịch" },
    { title: "Thời gian" },
    { title: "Thao tác" },
    { title: "Trạng thái" },
    { title: "Số tiền" },
]

const Status = [
    { statusEN: "success", statusVI: "Thành công" },
    { statusEN: "fail", statusVI: "Thất bại" },
]

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data)

const TableReport: React.FC<TableReportProps> = ({ listItem, currentPage, itemsPerPage }) => {
    const startIndex = currentPage * itemsPerPage

    return (
        <table className="table-auto border-separate border border-black border-opacity-10 rounded-lg text-sm sm:text-base md:text-lg text-gray-600 text-center table">
            <thead>
                <tr>
                    {listTitleManagement.map((item, index) => (
                        <th className={`
                                font-semibold 
                                py-3 
                                md:whitespace-nowrap
                                px-1
                                ${index < listTitleManagement.length - 1 ?
                                "border-r border-b border-black border-opacity-10" :
                                "border-b"
                            }`}
                            key={index}
                        >
                            {item.title}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-base font-medium">
                {listItem.map((item, index) => {
                    const totalIndex = startIndex + index + 1

                    return (
                        <tr key={index}>
                            <td className="py-3 border-r border-black border-opacity-10">{totalIndex}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{item._id}</td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatShortTime(item.createdAt)}</td>
                            <td className="py-3 border-r border-black border-opacity-10">Thanh toán</td>
                            <td className="py-3 border-r border-black border-opacity-10">
                                {item.isDelete ? (
                                    <span className="text-red-500 font-semibold">Thất Bại</span>
                                ) : (
                                    <span className="text-green-500 font-semibold">Thành Công</span>
                                )}
                            </td>
                            <td className="py-3 border-r border-black border-opacity-10">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

const ReportManagement = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [dateRange, setDateRange] = useState({
        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    })

    const { store } = useContext(GlobalContext) || {}

    const { data: listIncoming, error, isLoading } = useSWR<ManagementReportData[]>(dateRange.endDate && dateRange.startDate ? `/transaction/filter?storeId=${store ? store.id : ""}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : null, fetcher)

    const filteredIncoming = listIncoming && listIncoming.filter(item => item.createdAt && removeVietnameseTones(item.createdAt).includes(removeVietnameseTones(searchTerm)))
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 10
    const pageCount = Math.ceil(filteredIncoming ? filteredIncoming.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = filteredIncoming && filteredIncoming.length > 0 ? filteredIncoming.slice(startIndex, endIndex) : []

    // Tính toán theo ngày
    const dataByDate = listIncoming?.reduce((acc: any, item) => {
        const date = format(parseISO(item.createdAt), "dd/MM/yyyy");

        if (!acc[date]) {
            acc[date] = 0;
        }

        if (item.isDelete) {
            acc[date] -= parseFloat(item.totalPrice.toString());
        } else {
            acc[date] += parseFloat(item.totalPrice.toString());
        }

        return acc;
    }, {});

    const labels = dataByDate ? Object.keys(dataByDate) : [];
    const data = dataByDate ? Object.values(dataByDate) : [];

    // Tính toán theo loại hành động
    const dataByType = listIncoming?.reduce((acc: any, item) => {
        const formattedType = item.isDelete ? "Thất bại" : "Thành công";
        const totalPrice = parseFloat(item.totalPrice.toString());

        if (!acc[formattedType]) {
            acc[formattedType] = 0;
        }

        acc[formattedType] += totalPrice;

        return acc;
    }, {});

    const dataPercentages = dataByType
        ? Object.entries(dataByType).map(([type, amount]) => ({
            type,
            amount,
            percentage: amount as number,
        }))
        : [];
    const labelsPie = dataByType ? Object.keys(dataByType) : [];

    // Tính tổng số tiền
    const calculateTotal = (listIncoming: ManagementReportData[]) => {
        return listIncoming.reduce((total, item) => {
            if (!item.isDelete) {
                total += parseFloat(item.totalPrice.toString());
            }
            return total;
        }, 0);
    };

    return (
        <section className="relative flex flex-col px-6 py-10 gap-5">
            <div className="
                    flex 
                    flex-col 
                    text-gray-600 
                    gap-5
                    md:flex-row 
                    md:justify-between 
                    md:items-center 
                    md:gap-0
                    transition-all
                    duration-500
                "
            >
                <h1 className="font-semibold md:text-4xl text-3xl flex-shrink-0">
                    Quản lý doanh thu
                </h1>
            </div>
            <div className="relative py-2 md:w-1/2 justify-start w-full">
                <Datepicker
                    i18n={"vi"}
                    value={dateRange}
                    onChange={(NewDate: any) => {
                        if (NewDate.startDate && NewDate.endDate) {
                            const startDate = parse(NewDate.startDate, 'yyyy-MM-dd', new Date());
                            const endDate = parse(NewDate.endDate, 'yyyy-MM-dd', new Date());

                            if (startDate instanceof Date && !isNaN(startDate.getTime()) &&
                                endDate instanceof Date && !isNaN(endDate.getTime())) {
                                setDateRange({
                                    startDate: format(startDate, 'yyyy-MM-dd'),
                                    endDate: format(endDate, 'yyyy-MM-dd')
                                });
                            } else {
                                console.error('Invalid date');
                            }
                        } else {
                            const today = new Date();
                            setDateRange({
                                startDate: format(today, 'yyyy-MM-dd'),
                                endDate: format(today, 'yyyy-MM-dd')
                            });
                        }
                    }}
                    primaryColor={"orange"}
                    displayFormat={"DD/MM/YYYY"}
                    inputClassName="light w-full bg-[#F5F5F5] border-none py-3 px-6 focus:ring-0 rounded-lg"
                />
            </div>
            <div className="md:grid md:grid-cols-3 flex flex-col gap-5">
                <div className="col-span-2">
                    <div className="
                            flex 
                            flex-col
                            text-gray-600 
                            justify-between
                            transition-all
                            duration-500
                            flex-wrap
                        "
                    >
                        <h1 className="font-semibold md:text-3xl text-2xl flex-shrink-0">
                            Biểu đồ doanh thu
                        </h1>
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-row gap-3">
                                <div className="md:text-lg font-medium">
                                    Số lượng:
                                </div>
                                <div className="text-primary-blue-cus md:text-2xl text-xl font-semibold">
                                    {listIncoming && listIncoming.length > 0 ? listIncoming.length : 0}
                                </div>
                            </div>
                            <div className="flex flex-row gap-3">
                                <div className="md:text-lg font-medium">
                                    Tổng:
                                </div>
                                <div className="text-primary-blue-cus md:text-2xl text-xl font-semibold">
                                    {listIncoming && listIncoming.length > 0 ? formatCurrency(calculateTotal(listIncoming)) : formatCurrency(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full">
                        {isLoading ? (
                            <div className="h-96 flex items-center justify-center">
                                <LoadingFullScreen loading={isLoading} />
                            </div>
                        ) : !listIncoming || listIncoming.length === 0 ? (
                            <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                                Không có doanh thu nào tồn tại
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                                Lỗi API
                            </div>
                        ) : (
                            <div className="relative w-full h-[300px] sm:h-[500px] md:h-[300px] lg:h-[500px]">
                                <Line
                                    data={{
                                        labels: labels,
                                        datasets: [{
                                            label: "Lịch sử ví",
                                            data: data,
                                            fill: false,
                                            backgroundColor: 'rgb(75, 192, 192)',
                                            borderColor: 'rgba(75, 192, 192, 0.2)',
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="
                            text-gray-600 
                            justify-between
                            transition-all
                            duration-500
                            flex-wrap
                        "
                    >
                        <h1 className="font-semibold md:text-3xl text-2xl flex-shrink-0">
                            Các khoản doanh thu
                        </h1>
                    </div>
                    <div className="relative w-full">
                        {isLoading ? (
                            <div className="h-96 flex items-center justify-center">
                                <LoadingFullScreen loading={isLoading} />
                            </div>
                        ) : !listIncoming || listIncoming.length === 0 ? (
                            <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                                Không có doanh thu nào tồn tại
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                                Lỗi API
                            </div>
                        ) : (
                            <div className="relative w-full h-[300px] sm:h-[500px] md:h-[300px] lg:h-[500px]">
                                <Pie
                                    data={{
                                        labels: labelsPie,
                                        datasets: [{
                                            data: dataPercentages.map(item => item.percentage),
                                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', "#00FF33"],
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="
                    flex 
                    flex-col 
                    text-gray-600 
                    gap-5
                    md:flex-row 
                    md:justify-between 
                    md:items-center 
                    md:gap-0
                    transition-all
                    duration-500
                "
            >
                <h1 className="font-semibold md:text-3xl text-2xl flex-shrink-0">
                    Bảng doanh thu
                </h1>
                <div className="flex gap-3 flex-col md:flex-row transition-all duration-500 flex-wrap justify-end">
                    <div className="flex flex-col space-y-1 md:w-auto w-full transition-all duration-500">
                        <Search value={searchTerm} onChange={setSearchTerm} style="w-full" />
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                    <LoadingFullScreen loading={isLoading} />
                </div>
            ) : !listIncoming || !filteredIncoming || listIncoming.length === 0 ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                    Không có doanh thu nào tồn tại
                </div>
            ) : error ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                    Lỗi API
                </div>
            ) : filteredIncoming && filteredIncoming.length === 0 ? (
                <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-96">
                    Doanh thu trong khoản này không tồn tại
                </div>
            ) : (
                <>
                    <TableReport listItem={visibleItems} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                    {pageCount > 0 && (
                        <div className="flex justify-center mt-10 text-base font-semibold">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={4}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageChange}
                                containerClassName="pagination flex p-0 m-0"
                                activeClassName="text-gray-400 bg-gray-200"
                                previousLabel="<"
                                nextLabel=">"
                                pageClassName="border-2 px-4 py-2"
                                previousClassName="border-2 px-4 py-2"
                                nextClassName="border-2 px-4 py-2"
                                pageLinkClassName="pagination-link"
                                nextLinkClassName="pagination-link"
                                breakClassName="pagination-items border-2 px-3 py-2"
                            />
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default ReportManagement