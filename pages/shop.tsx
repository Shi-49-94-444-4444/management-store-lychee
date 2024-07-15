import ModalCart from "@/app/components/providers/modal/cart/ModalCart"
import ShopItems from "@/app/components/shop/ShopItems"
import Layout from "@/app/layout"

const ShopPage = () => {
  return (
    <Layout>
      <ModalCart />
      <ShopItems />
    </Layout>
  )
}

export default ShopPage