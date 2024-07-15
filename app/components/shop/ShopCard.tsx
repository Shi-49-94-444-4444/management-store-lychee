import { Product } from "@/types";
import { formatCurrency } from "@/utils/format";
import { validateURLProduct } from "@/utils/validData";
import Image from "next/image";

interface ShopCardProps {
    product: Product
    handleClick: () => void
}

const ShopCard: React.FC<ShopCardProps> = ({
    product,
    handleClick
}) => {
    return (
        <section className="col-span-1" key={product._id} onClick={handleClick}>
            <div className="flex flex-col border border-black border-opacity-10 hover:border-primary-cus h-fit w-full rounded-md shadow-md">
                <div className="w-full h-40 relative flex-shrink-0">
                    <Image
                        src={validateURLProduct(product.imageUrl)}
                        alt={`product ${product._id}`}
                        width={300}
                        height={160}
                        className="w-full h-40 object-fill"
                    />
                </div>
                <div className="flex flex-col gap-1 p-3">
                    <div className="text-md font-semibold line-clamp-1">{product.name}</div>
                    <div className="text-md">Số lượng hàng: {product.totalStock} kg</div>
                    <div className="text-md">Giá: {formatCurrency(product.price ? product.price : 0)}</div>
                </div>
            </div>
        </section>
    )
}

export default ShopCard