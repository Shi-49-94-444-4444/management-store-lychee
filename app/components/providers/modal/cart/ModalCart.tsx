"use client"

import { Cart, GlobalContext } from "@/contexts"
import { useContext, useEffect, useRef, useState } from "react"
import CustomModal from "../Modal"
import { LoadingActionWallet } from "../../loader"
import { toast } from "react-toastify"
import { useCartModal } from "@/hooks/useCart"
import Image from "next/image"
import { validateURLProduct } from "@/utils/validData"
import { formatCurrency } from "@/utils/format"
import { createTransactionService } from "@/services/transaction.service"
import { mutate } from "swr"

const ModalCart = () => {
    const cartModal = useCartModal()
    const { setIsLoadingModal, isLoadingModal, cart, setCart, user, store } = useContext(GlobalContext) || {}
    const [paymentMethod, setPaymentMethod] = useState(false);
    const newWindowRef = useRef<any>(null)
    const [windowOpened, setWindowOpened] = useState(false)

    const decreaseQuantity = async (productId: string) => {
        if (setCart) {
            setCart((prevCart: Cart[] | null) => {
                if (!prevCart) return null;
                const updatedCart = prevCart.map(item => {
                    if (item.product._id === productId) {
                        if (item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return null;
                        }
                    }
                    return item;
                }).filter((item): item is Cart => item !== null);
                return updatedCart.length > 0 ? updatedCart : null;
            });
        }
    };

    const increaseQuantity = async (productId: string) => {
        if (setCart) {
            setCart((prevCart: Cart[] | null) => {
                if (!prevCart) return null;
                const updatedCart = prevCart.map(item => {
                    if (item.product._id === productId) {
                        if (item.quantity < item.product.totalStock) {
                            return { ...item, quantity: item.quantity + 1 };
                        } else {
                            toast.error(`Sản phẩm ${item.product.name} chỉ còn ${item.product.totalStock} trong kho.`);
                        }
                    }
                    return item;
                });
                return updatedCart;
            });
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
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

    const handleCreateTransaction = async () => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (!cart) {
            toast.error("Vui lòng chọn hàng", {
                position: "top-right"
            })
            if (setIsLoadingModal) setIsLoadingModal(false)
            cartModal.onClose()
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
                paymentMethod: paymentMethod
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
                cartModal.onClose()
                if (setIsLoadingModal) setIsLoadingModal(false)
            }
        }
    }

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'payment success') {
                if (setCart) setCart(null)
                mutate(`/product/filter?storeId=${store ? store.id : ""}&supplierId=`)
                cartModal.onClose()
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

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    return (
        <CustomModal
            isOpen={cartModal.isOpen}
            onClose={cartModal.onClose}
            width="w-[80%]"
            height="h-fit"
        >
            <form className="flex flex-col md:px-10 pb-5 gap-5 justify-center items-center">
                <div className="text-center text-3xl text-primary-cus font-semibold pb-5">
                    Giỏ hàng
                </div>
                <div className="relative py-5 flex flex-col gap-3">
                    <section className="grid grid-cols-12 gap-2 bg-white border border-black border-opacity-10 text-gray-500 py-3 px-8 rounded-sm shadow-sm">
                        <div className="col-span-5">
                            Sản Phẩm
                        </div>
                        <div className="col-span-2 text-center">
                            Đơn Giá
                        </div>
                        <div className="col-span-2 text-center">
                            Số Lượng
                        </div>
                        <div className="col-span-2 text-center">
                            Số Tiền
                        </div>
                        <div className="col-span-1 text-center">
                            Thao Tác
                        </div>
                    </section>
                    {!cart ? (
                        <div className="w-full relative flex flex-col space-x-3 items-center justify-center h-80 text-primary-blue-cus">
                            <p className="md:text-4xl text-3xl font-semibold">Vui lòng mua hàng!!!</p>
                            <div className="relative">
                                <Image
                                    src="/images/sad.gif"
                                    alt="Gif"
                                    width={100}
                                    height={100}
                                    className="object-contain md:w-32 md:h-32 h-20 w-20 transition-all duration-500"
                                />
                            </div>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <>
                                <section className="grid grid-cols-12 gap-2 items-center p-8" key={item.product._id}>
                                    <div className="col-span-5">
                                        <div className="w-full flex flex-row gap-2 items-start">
                                            <div className="relative flex-shrink-0 w-32 h-32">
                                                <Image
                                                    src={validateURLProduct(item.product.imageUrl)}
                                                    alt="product"
                                                    className="w-32 h-32 object-cover"
                                                    width={128}
                                                    height={128}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="text-xl hover:text-primary-cus">
                                                    {item.product.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        {formatCurrency(item.product.price ? item.product.price : 0)}
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <div className="flex flex-row gap-3 items-center">
                                            <div className="flex flex-row text-md text-gray-600 font-semibold border border-black border-opacity-10 w-fit">
                                                <button className="border border-r border-black border-opacity-10 px-4" onClick={() => decreaseQuantity(item.product._id)}>
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="w-12 text-center py-1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleInputChange(e, item.product._id)}
                                                />
                                                <button className="border border-l border-black border-opacity-10 px-4" onClick={() => increaseQuantity(item.product._id)}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center text-primary-cus text-xl font-semibold">
                                        {formatCurrency(item.product.price ? (item.product.price * item.quantity) : 0)}
                                    </div>
                                    <button className="col-span-1 text-primary-cus cursor-pointer text-center" onClick={() => handleRemoveProduct(item.product._id)}>
                                        Xóa
                                    </button>
                                </section>
                                <div className="border border-b border-black border-opacity-10 relative w-full" />
                            </>
                        ))
                    )}
                    <section className="flex flex-col gap-3 bg-white border border-black border-opacity-10 py-3 px-8 rounded-sm shadow-sm">
                        <div className="flex flex-row gap-3 justify-end">
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
                        <div className="flex flex-row justify-end items-center gap-3">
                            <div className="text-lg">
                                Tổng sản phẩm thanh toán ({countProduct} sản phẩm):
                            </div>
                            <div className="text-primary-cus text-md text-3xl">
                                {formatCurrency(total)}
                            </div>
                            <button className="text-white bg-primary-cus hover:bg-red-500 py-2 px-10 text-md font-semibold" onClick={handleCreateTransaction}>
                                Mua Hàng
                            </button>
                        </div>
                    </section>
                </div>
            </form>
        </CustomModal>
    )
}

export default ModalCart