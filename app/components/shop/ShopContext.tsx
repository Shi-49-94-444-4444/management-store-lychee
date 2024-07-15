import { Product } from "@/types"
import { formatCurrency } from "@/utils/format"
import { validateURLProduct } from "@/utils/validData"
import Image from "next/image"
import { FaCartPlus } from "react-icons/fa"

interface ShopContextProps {
    item: Product
    handleClick: () => void
    quantity: number
    decreaseQuantity: () => void
    increaseQuantity: () => void
    onChange: (e: any) => void
}

const ShopContext: React.FC<ShopContextProps> = ({
    item,
    handleClick,
    quantity,
    decreaseQuantity,
    increaseQuantity,
    onChange
}) => {
    return (
        <div className="col-span-2 animate-fade-in-right border rounded-md h-full">
            <div className="flex flex-col gap-3 p-4 h-full justify-around">
                <div className="w-full h-60 relative flex-shrink-0">
                    <Image
                        src={validateURLProduct(item.imageUrl)}
                        alt={`product ${item._id}`}
                        width={500}
                        height={800}
                        className="w-full h-60 object-fill"
                    />
                </div>
                <p className="text-lg font-semibold line-clamp-2">{item.name}</p>
                <p className="text-lg">Số lượng hàng: {item.totalStock} kg</p>
                <p className="text-lg">Giá: {formatCurrency(item.price ? item.price : 0)}</p>
                <p className="text-lg">Nhà cung cấp: {item.supplier?.name}</p>
                <p className="text-lg line-clamp-5">Mô tả: {item.description}</p>
                <section className="flex w-full items-center justify-center">
                    <div className="flex flex-row gap-3 items-center">
                        <div className="flex flex-row text-md text-gray-600 font-semibold border border-black border-opacity-10 w-fit">
                            <button className="border border-r border-black border-opacity-10 px-4 py-1" onClick={decreaseQuantity}>
                                -
                            </button>
                            <input
                                type="number"
                                className="w-12 text-center"
                                value={quantity}
                                onChange={onChange}
                            />
                            <button className="border border-l border-black border-opacity-10 px-4 py-1" onClick={increaseQuantity}>
                                +
                            </button>
                        </div>
                    </div>
                </section>
                <button className="flex flex-row gap-2 px-2 py-1 w-full h-14 items-center justify-center text-primary-cus bg-red-100 hover:bg-red-50 border border-primary-cus" onClick={handleClick}>
                    <span>
                        <FaCartPlus size={30} />
                    </span>
                    <span>
                        Thêm vào giỏ hàng
                    </span>
                </button>
            </div>
        </div>
    )
}

export default ShopContext