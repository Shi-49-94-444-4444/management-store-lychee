"use client"

import PostNewForm from "@/app/components/post";
import Layout from "@/app/layout"
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function UserManagementPage() {
    const router = useRouter()

    return (
        <Layout>
            <div className="relative my-5 p-4 bg-white">
                <div className="relative mb-10">
                    <div className="
                            flex 
                            text-primary-cus
                            pb-5
                            space-x-3
                            font-semibold
                            items-center
                        "
                    >
                        <button className="relative" type="button" onClick={() => router.back()}>
                            <IoMdArrowRoundBack size={40} />
                        </button>
                        <h1 className="font-semibold md:text-4xl text-3xl flex-shrink-0">
                            Đăng Sản Phẩm
                        </h1>
                    </div>
                </div>
                <PostNewForm />
            </div>
        </Layout>
    );
}
