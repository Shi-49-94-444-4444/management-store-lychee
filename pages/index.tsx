"use client"

import LoginForm from "@/app/components/auth/LoginForm"
import LoginUI from "@/app/components/auth/LoginUI"

const Home = () => {
    return (
      <LoginUI>
        <LoginForm />
      </LoginUI>
    )
}

export default Home