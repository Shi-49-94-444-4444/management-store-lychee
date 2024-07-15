"use client"

import { useContext, useState } from "react";
import useSWR from "swr";
import axiosInstance from "@/libs/axios";
import { Cart, GlobalContext } from "@/contexts";
import Button from "../providers/form/Button";
import Search from "../providers/form/Search";
import { Product } from "@/types";
import { TiShoppingCart } from "react-icons/ti";
import { removeVietnameseTones } from "@/utils/format";
import ReactPaginate from "react-paginate";
import { LoadingFullScreen } from "../providers/loader";
import ShopCard from "./ShopCard";
import ShopContext from "./ShopContext";
import { useCartModal } from "@/hooks/useCart";
import { toast } from "react-toastify";


const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const ShopItems = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [item, setItem] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1);
    const cartModal = useCartModal()

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const { store, setCart } = useContext(GlobalContext) || {}

    const { data: listProduct, error, isLoading } = useSWR<Product[]>(`/product/filter?storeId=${store ? store.id : ""}&supplierId=`, fetcher)

    const validProducts = listProduct ? listProduct.filter((product) => product.totalStock !== 0) : []

    const filteredProducts = validProducts && validProducts.filter(product => product.name && removeVietnameseTones(product.name).includes(removeVietnameseTones(searchTerm)))

    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = item ? 12 : 15
    const pageCount = Math.ceil(filteredProducts ? filteredProducts.length / itemsPerPage : 0)

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected)
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleItems = filteredProducts && filteredProducts.length > 0 ? filteredProducts.slice(startIndex, endIndex) : []

    const handleClickItem = (data: Product) => {
        setItem(data)
        setQuantity(1)
    }

    const handleAddToCart = (data: Product) => {
        if (setCart) {
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
                    toast.success("Thêm vào giỏ hàng thành công");
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

    return (
        <section className={`relative flex flex-col ${item ? "pl-6" : "px-10"} py-10 h-full`}>
            <div className={`grid ${item ? "grid-cols-7" : ""} h-full gap-5`}>
                <div className="col-span-5">
                    <div className="
                            flex 
                            text-primary-cus
                            gap-5
                            pb-10
                            items-center
                        "
                    >
                        <Search value={searchTerm} onChange={setSearchTerm} style="w-full" />
                        <div className="flex-shrink-0">
                            <Button
                                title="Giỏ hàng"
                                iconLeft={<TiShoppingCart size={30} />}
                                style="px-4 py-2"
                                onClick={() => cartModal.onOpen()}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="h-screen flex items-center justify-center">
                            <LoadingFullScreen loading={isLoading} />
                        </div>
                    ) : !listProduct || !filteredProducts || listProduct.length === 0 ? (
                        <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                            Không có sản phẩm nào tồn tại
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                            Lỗi API
                        </div>
                    ) : filteredProducts && filteredProducts.length === 0 ? (
                        <div className="flex items-center justify-center md:text-4xl text-3xl text-primary-blue-cus font-semibold h-screen">
                            Sản phẩm này không tồn tại
                        </div>
                    ) : (
                        <div className={`grid ${item ? "grid-cols-4" : "grid-cols-5"} gap-4`}>
                            {visibleItems.map((product, index) => (
                                <ShopCard
                                    key={index}
                                    product={product}
                                    handleClick={() => handleClickItem(product)}
                                />
                            ))}
                            {pageCount > 1 && (
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
                        </div>
                    )}
                </div>
                {item && (
                    <ShopContext
                        item={item}
                        quantity={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        handleClick={() => { handleAddToCart(item) }}
                    />
                )}
            </div>
        </section>
    )
}

export default ShopItems