import DetailProduct from "@/app/components/DetailProduct"
import ModalAddStock from "@/app/components/providers/modal/stock/ModalAddStock"
import ModalDeleteStock from "@/app/components/providers/modal/stock/ModalDeleteStock"
import ModalTransfer from "@/app/components/providers/modal/stock/ModalTransfer"
import Layout from "@/app/layout"

const DetailProductPage = () => {
  return (
    <Layout>
      <ModalAddStock />
      <ModalDeleteStock />
      <ModalTransfer />
      <DetailProduct />
    </Layout>
  )
}

export default DetailProductPage