import ModalBlock from "@/app/components/providers/modal/user/ModalBlock"
import ModalRegister from "@/app/components/providers/modal/user/ModalRegister"
import UserManagement from "@/app/components/UserManagement"
import Layout from "@/app/layout"

const UserManagementPage = () => {
    return (
        <Layout>
            <ModalRegister />
            <ModalBlock />
            <UserManagement />
        </Layout>
    )
}

export default UserManagementPage