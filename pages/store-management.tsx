import ModalAddStore from "@/app/components/providers/modal/store/ModalAddStore"
import StoreManagement from "@/app/components/StoreManagement"
import Layout from "@/app/layout"

const StoreManagementPage = () => {
    return (
        <Layout>
            <ModalAddStore />
            <StoreManagement />
        </Layout>
    )
}

export default StoreManagementPage