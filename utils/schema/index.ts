import * as yup from "yup";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const loginSchema = yup.object().shape({
    email: yup.string().
        required("Email không được để trống").
        email("Email không hợp lệ"),
    password: yup.string().
        required("Mật khẩu không được để trống").
        min(6, "Mật khẩu phải có ít nhất 6 ký tự").
        max(50, "Mật khẩu chỉ được nhiều nhất 50 ký tự"),
})

export const storeAddSchema = yup.object().shape({
    name: yup.string().required("Không được để trống").max(100, "Tối đa 100 ký tự"),
    address: yup.string().required("Không được để trống").max(100, "Tối đa 100 ký tự"),
})

export const registerSchema = yup.object().shape({
    username: yup.string().
        required("Tên không được để trống ").
        min(4, "Tên tối thiểu 4 kí tự").
        max(50, "Tên nhiều nhất chỉ được 50 kí tự"),
    email: yup.string().
        required("Email không được để trống").
        email("Email không hợp lệ").
        max(50, "Mail nhiều nhất chỉ được 50 kí tự"),
    phone: yup.string().
        required("Số điện thoại không được để trống").
        matches(phoneRegExp, "Số điện thoại phải nhập số").
        min(7, "Số điện thoại có ít nhất 7 số").
        max(15, "Số điện thoại nhiều nhất 15 số"),
    password: yup.string().
        required("Mật khẩu không được để trống").
        min(6, "Mật khẩu phải có ít nhất 6 ký tự").
        max(50, "Mật khẩu nhiều nhất 50 ký tự"),
    confirmPassword: yup.string().
        required("Mật khẩu xác nhận không được để trống").
        oneOf([yup.ref("password"), ""], "Mật khẩu xác nhận phải khớp"),
})

export const postProductSchema = yup.object().shape({
    name: yup.string().
        required("Tên sản phẩm không được để trống ").
        min(4, "Tên tối thiểu 4 kí tự").
        max(100, "Tên nhiều nhất chỉ được 100 kí tự"),
    description: yup.string().
        required("Mô tả không được để trống ").
        min(10, "Mô tả tối thiểu 10 kí tự").
        max(1000, "Mô tả nhiều nhất chỉ được 1000 kí tự"),
    price: yup.number().
        required("Giá không được để trống").
        min(1000, "Tối thiểu 1.000 VNĐ").
        max(10000000, "Tối đa 1.000.000 VNĐ"),
})

export const stockAddSchema = yup.object().shape({
    quantity: yup.number().required("Không được để trống").min(1, "Số lượng hàng tối thiểu là 1 kg"),
    price: yup.number().required("Không được để trống").min(10000, "Giá tiền tối thiểu là 10.000VNĐ"),
})

export const refundSchema = yup.object().shape({
    price: yup.number().required("Không được để trống").min(10000, "Giá tiền tối thiểu là 10.000VNĐ"),
    reason: yup.string().
        required("Lý do không được để trống ").
        min(10, "Lý do tối thiểu 10 kí tự").
        max(1000, "Lý do nhiều nhất chỉ được 1000 kí tự"),
})

export const transferSchema = yup.object().shape({
    quantity: yup.number().required("Không được để trống").min(1, "Số lượng hàng tối thiểu là 1 kg"),
})