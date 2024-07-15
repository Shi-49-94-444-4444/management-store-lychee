import ProductManagement from "@/app/components/ProductManagement"
import ModalDeleteProduct from "@/app/components/providers/modal/product/ModalDelete"
import ModalAddStock from "@/app/components/providers/modal/stock/ModalAddStock"
import Layout from "@/app/layout"

const ProductManagementPage = () => {
  return (
    <Layout>
      <ModalDeleteProduct />
      <ModalAddStock />
      <ProductManagement />
    </Layout>
  )
}

export default ProductManagementPage