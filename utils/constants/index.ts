import { Option } from "@/types";
import { BsFillFileEarmarkPostFill, BsFillFileEarmarkRuledFill } from "react-icons/bs"
import { FaHome, FaUserFriends } from "react-icons/fa"

export const roleAdmin = "admin"
export const roleManage = "manage"
export const roleStaff = "staff"
export const statusNormal = "normal"
export const statusNearExpiry = "near expiry"
export const statusExpired = "expired"

export const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        paddingLeft: '1rem',
        marginLeft: '0px',
        backgroundColor: '#F5F5F5',
        paddingTop: '5px',
        paddingBottom: '5px',
        boxShadow: 'none !important',
        "*": {
            boxShadow: "none !important",
        },
        '&:hover': {
            border: 'none !important',
            boxShadow: 'none !important',
            outline: 'none !important',
        },
        '&:focus': {
            border: 'none !important',
            boxShadow: 'none !important',
            outline: 'none !important',
        },
    }),
}

export const loginInputs = [
    {
        id: "email",
        label: "Tài Khoản",
        placeholder: "Nhập email được cấp",
        type: "email",
        name: "email"
    },
    {
        id: "password",
        label: "Mật khẩu",
        placeholder: "Nhập mật khẩu được cấp",
        type: "password",
        name: "password"
    }
];

export const adminOptions: Option[] = [
    { id: 1, label: "Quản lý tổng", icon: FaHome, case: "/home" },
    { id: 2, label: "Quản lí người dùng", icon: FaUserFriends, case: "/user-management" },
    { id: 3, label: "Quản lí chi nhánh", icon: FaUserFriends, case: "/store-management" },
    { id: 4, label: "Quản lí sản phẩm", icon: BsFillFileEarmarkPostFill, case: "/product-management" },
    { id: 5, label: "Quản lí đơn hàng", icon: BsFillFileEarmarkRuledFill, case: "/transaction-management" },
    { id: 6, label: "Quản lí doanh thu", icon: BsFillFileEarmarkRuledFill, case: "/report-management" },
]

export const manageOptions: Option[] = [
    { id: 1, label: "Quản lý tổng", icon: FaHome, case: "/home" },
    { id: 2, label: "Cửa hàng", icon: FaUserFriends, case: "/shop" },
    { id: 3, label: "Quản lí người dùng", icon: FaUserFriends, case: "/user-management" },
    { id: 4, label: "Quản lí sản phẩm", icon: BsFillFileEarmarkPostFill, case: "/product-management" },
    { id: 5, label: "Quản lí đơn hàng", icon: BsFillFileEarmarkRuledFill, case: "/transaction-management" },
    { id: 6, label: "Quản lí doanh thu", icon: BsFillFileEarmarkRuledFill, case: "/report-management" },
]

export const staffOptions: Option[] = [
    { id: 1, label: "Quản lý tổng", icon: FaHome, case: "/home" },
    { id: 2, label: "Cửa hàng", icon: FaUserFriends, case: "/shop" },
    { id: 3, label: "Quản lí sản phẩm", icon: BsFillFileEarmarkPostFill, case: "/product-management" },
    { id: 4, label: "Quản lí đơn hàng", icon: BsFillFileEarmarkRuledFill, case: "/transaction-management" },
]

export const registerInputs = [
    {
        id: "email",
        label: "Email",
        placeholder: "Nhập email",
        type: "email",
        name: "email"
    },
    {
        id: "username",
        label: "Tên",
        placeholder: "Nhập tên",
        type: "text",
        name: "username"
    },
    {
        id: "password",
        label: "Mật khẩu",
        placeholder: "Nhập mật khẩu",
        type: "password",
        name: "password"
    },
    {
        id: "confirmPassword",
        label: "Xác nhận mật khẩu",
        placeholder: "Nhập lại mật khẩu",
        type: "password",
        name: "confirmPassword"
    },
    {
        id: "phone",
        label: "Số điện thoại",
        placeholder: "Nhập số điện thoại",
        type: "number",
        name: "phone",
        maxLength: 15
    }
];

export const postProductInputs = [
    {
        id: "name",
        label: "Tên sản phẩm:",
        type: "text",
        name: "name"
    },
    {
        id: "price",
        label: "Giá tiền",
        type: "number",
        name: "price",
    },
];