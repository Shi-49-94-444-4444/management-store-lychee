import ModalRefund from "@/app/components/providers/modal/transaction/ModalRefund"
import TransactionManagement from "@/app/components/TransactionManagement"
import Layout from "@/app/layout"

const TransactionManagementPage = () => {
  return (
    <Layout>
      <ModalRefund />
      <TransactionManagement />
    </Layout>
  )
}

export default TransactionManagementPage