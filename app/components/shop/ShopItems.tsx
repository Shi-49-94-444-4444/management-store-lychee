"use client"

import { useContext, useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import axiosInstance from "@/libs/axios";
import { Cart, GlobalContext } from "@/contexts";
import Search from "../providers/form/Search";
import { Product } from "@/types";
import { formatCurrency, removeVietnameseTones } from "@/utils/format";
import { toast } from "react-toastify";
import Image from "next/image";
import { validateURLProduct } from "@/utils/validData";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { createTransactionService } from "@/services/transaction.service";
import { LoadingActionWallet } from "../providers/loader";

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const ShopItems = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [quantity, setQuantity] = useState(1);
    const [showResult, setShowResult] = useState(false)
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [paymentMethod, setPaymentMethod] = useState(false);
    const newWindowRef = useRef<any>(null)
    const [windowOpened, setWindowOpened] = useState(false)

    const { store, setCart, cart, setIsLoadingModal, isLoadingModal, user } = useContext(GlobalContext) || {}

    const { data: listProduct, error, isLoading } = useSWR<Product[]>(`/product/filter?storeId=${store ? store.id : ""}&supplierId=`, fetcher)

    const fetchValue = async (value: string) => {
        if (value.trim() === "") {
            setSearchResults([]);
            setShowResult(false)
        } else {
            const filterProduct = listProduct?.filter((acc) => acc.totalStock > 0)
            const filterResult = filterProduct?.filter((result) => {
                return result && result.name && removeVietnameseTones(result.name).includes(removeVietnameseTones(value))
            })

            setSearchResults(filterResult ?? [])
            setShowResult(true)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        fetchValue(e.target.value)
    }

    const handleAddToCart = (data: Product) => {
        if (setCart) {
            setSearchTerm("")
            fetchValue("")
            setCart((prevCart: Cart[] | null) => {
                const cartItems = prevCart ? prevCart : [];
                const existingProduct = cartItems.find(item => item.product._id === data._id);
                const newQuantity = existingProduct ? existingProduct.quantity + quantity : quantity;

                if (newQuantity > data.totalStock) {
                    toast.error(`Sản phẩm ${data.name} chỉ còn ${data.totalStock} trong kho.`);
                    if (existingProduct) {
                        return cartItems.map(item =>
                            item.product._id === data._id
                                ? { ...item, quantity: data.totalStock }
                                : item
                        );
                    } else {
                        return [...cartItems, { product: data, quantity: data.totalStock }];
                    }
                } else {
                    if (existingProduct) {
                        return cartItems.map(item =>
                            item.product._id === data._id
                                ? { ...item, quantity: newQuantity }
                                : item
                        );
                    } else {
                        return [...cartItems, { product: data, quantity }];
                    }
                }
            });
        }
    }
    const handleCreateTransaction = async () => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (!cart) {
            toast.error("Vui lòng chọn hàng", {
                position: "top-right"
            })
            if (setIsLoadingModal) setIsLoadingModal(false)
            return
        }

        if (cart && user && store) {
            const res = await createTransactionService({
                userId: user._id,
                storeId: store.id,
                cart: cart.map(item => ({
                    product: {
                        _id: item.product._id,
                        price: item.product.price
                    },
                    quantity: item.quantity
                })),
                paymentMethod: paymentMethod,
                status: "successful"
            })

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            if (paymentMethod) {
                let windowWidth = 600;
                let windowHeight = 800;
                let yPosition = window.outerHeight / 2 - windowHeight / 2 + window.screenY;
                let xPosition = window.outerWidth / 2 - windowWidth / 2 + window.screenX;

                newWindowRef.current = window.open(res.data.paymentUrl, "NewWindow", `height=${windowHeight}, width=${windowWidth}, top=${yPosition}, left=${xPosition}`)
                setWindowOpened(true)
            } else {
                toast.success(res.message, {
                    position: "top-right"
                });
                if (setCart) setCart(null)
                mutate(`/product/filter?storeId=${store ? store.id : ""}&supplierId=`)
                if (setIsLoadingModal) setIsLoadingModal(false)
            }
        }
    }

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'payment success') {
                if (setCart) setCart(null)
                mutate(`/product/filter?storeId=${store ? store.id : ""}&supplierId=`)
                if (setIsLoadingModal) setIsLoadingModal(false)
            } if (event.data === 'payment failure') {
                if (setIsLoadingModal) setIsLoadingModal(false)
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [setIsLoadingModal])

    useEffect(() => {
        let checkWindowClosed: NodeJS.Timeout;

        if (windowOpened) {
            checkWindowClosed = setInterval(function () {
                if (newWindowRef.current && newWindowRef.current.closed) {
                    clearInterval(checkWindowClosed)
                    if (setIsLoadingModal) setIsLoadingModal(false)
                    setWindowOpened(false)
                }
            }, 1000)
        }

        return () => {
            if (checkWindowClosed) {
                clearInterval(checkWindowClosed);
            }
        }
    }, [setIsLoadingModal, windowOpened])

    const handleQuantityChange = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        const value = Number(e.target.value);
        if (value <= 0) {
            toast.error("Số lượng không thể âm hoặc bằng 0.");
            return;
        }

        if (setCart) {
            setCart((prevCart: Cart[] | null) => {
                if (!prevCart) return null;
                const updatedCart = prevCart.map(item => {
                    if (item.product._id === productId) {
                        if (value > item.product.totalStock) {
                            toast.error(`Sản phẩm ${item.product.name} chỉ còn ${item.product.totalStock} trong kho.`);
                            return { ...item, quantity: item.product.totalStock };
                        } else {
                            return { ...item, quantity: value };
                        }
                    }
                    return item;
                });
                return updatedCart;
            });
        }
    };

    const handleRemoveProduct = async (productId: string) => {
        if (setCart) {
            setCart((prevCart: Cart[] | null) => {
                if (!prevCart) return null;
                return prevCart.filter(item => item.product._id !== productId);
            });
        }
    };

    const countProduct = cart ? cart.length : 0;
    const total = cart ? cart.reduce((acc, item) => {
        const price = item.product.price || 0;
        return acc + price * item.quantity;
    }, 0) : 0;

    return (
        <section className={`relative flex flex-col pl-6 py-10 h-full`}>
            {isLoadingModal && (
                <LoadingActionWallet loading={isLoadingModal} />
            )}
            <div className={`grid grid-cols-7 h-full gap-5`}>
                <div className="col-span-5">
                    <div className="
                            flex 
                            flex-col
                            text-primary-cus
                            gap-5
                            pb-3
                            items-center
                        "
                    >
                        <Search value={searchTerm} onChange={handleInputChange} style="w-full" />
                        {showResult && (
                            <div className="bg-white w-[1080px] py-2 border border-opacity-10 translate-y-12 z-20 absolute">
                                {searchResults.length > 0 ? (
                                    <div className="flex flex-col gap-2 p-2 max-h-80 overflow-auto">
                                        {searchResults.map((result) => (
                                            <div className="flex flex-col gap-1" key={result._id}>
                                                <div className="grid grid-cols-12 gap-2 items-center cursor-pointer" onClick={() => handleAddToCart(result)}>
                                                    <div className="col-span-2 flex-shrink-0">
                                                        <Image
                                                            src={validateURLProduct(result.imageUrl)}
                                                            alt={`Product -${result._id}`}
                                                            height={100}
                                                            width={100}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="col-span-4 text-lg">
                                                        {result.name}
                                                    </div>
                                                    <div className="col-span-3 flex justify-center text-lg">
                                                        Số lượng còn: {result.totalStock} kg
                                                    </div>
                                                    <div className="col-span-3 flex justify-end pr-10 text-2xl font-semibold">
                                                        {formatCurrency(result.price ?? 0)}
                                                    </div>
                                                </div>
                                                <div className="border-b" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-full w-full relative text-md font-semibold">
                                        Không tìm thấy sản phẩm
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="h-[850px] bg-slate-100 overflow-auto rounded-md z-[99999]">
                        <div className="flex flex-col gap-1 p-1">
                            {cart?.map((item, index) => (
                                <div className="grid grid-cols-12 gap-1 bg-white rounded-md p-2 items-center text-sm">
                                    <div className="col-span-3">
                                        {index + 1} - {item.product._id}
                                    </div>
                                    <div className="col-span-4 line-clamp-1">
                                        {item.product.name}
                                    </div>
                                    <div className="col-span-1 border-b w-fit">
                                        <input
                                            type="number"
                                            className="w-20 text-center py-1 border-none hover:border-none hover:outline-none hover:ring-0 focus:ring-0"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(e, item.product._id)}
                                        />
                                    </div>
                                    <div className="col-span-2 border-b text-end w-28 text-xl h-full">
                                        {formatCurrency(item.product.price ?? 0)}
                                    </div>
                                    <div className="col-span-1 text-end text-xl h-full font-semibold">
                                        {formatCurrency(item.product.price ? item.product.price * item.quantity : 0)}
                                    </div>
                                    <div className="col-span-1 flex flex-row gap-3 justify-end">
                                        <button>
                                            <IoEyeSharp size={25} />
                                        </button>
                                        <button onClick={() => handleRemoveProduct(item.product._id)}>
                                            <MdDelete size={25} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-2 border rounded-md h-full py-3 px-4 mr-3">
                    <h1 className="text-2xl font-semibold text-primary-cus">Tổng hóa đơn</h1>
                    <div className="flex flex-col gap-3 pt-5 text-lg h-full">
                        <div className="flex justify-between">
                            <div className="flex gap-5">
                                <p>
                                    Tổng tiền hàng
                                </p>
                                <div className="border rounded-2xl bg-slate-200 w-6 text-center">
                                    {countProduct}
                                </div>
                            </div>
                            <div>
                                {formatCurrency(total ?? 0)}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>
                                Giảm giá
                            </p>
                            <div className="border-b w-32 text-end">
                                {formatCurrency(0)}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>
                                Phụ thu khác
                            </p>
                            <div className="border-b w-32 text-end">
                                {formatCurrency(0)}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold">
                                Khách cần trả
                            </p>
                            <div className="text-xl text-primary-cus font-semibold">
                                {formatCurrency(total ?? 0)}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold">
                                Khách cần thanh toán
                            </p>
                            <div className="text-xl font-semibold border-b w-32 text-end">
                                {formatCurrency(total ?? 0)}
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 justify-center">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="transfer"
                                    className="form-radio text-primary-cus focus:ring-0"
                                    checked={paymentMethod === true}
                                    onChange={() => setPaymentMethod(true)}
                                />
                                Chuyển khoản
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    className="form-radio text-primary-cus focus:ring-0"
                                    checked={paymentMethod === false}
                                    onChange={() => setPaymentMethod(false)}
                                />
                                Tiền mặt
                            </label>
                        </div>
                        <div className="flex flex-col justify-end h-[580px]">
                            <button className="text-white bg-primary-cus hover:bg-red-500 py-3 text-md font-semibold rounded-md" onClick={handleCreateTransaction}>
                                Mua Hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopItems