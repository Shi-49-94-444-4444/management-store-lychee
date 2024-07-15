import Image from "next/image"

interface LoginUIProps {
    children: React.ReactNode
}

const LoginUI: React.FC<LoginUIProps> = ({ children }) => {
    return (
        <div className="
                relative
                inset-0
                lg:inset-auto
                bg-center 
                bg-cover
                bg-no-repeat
                w-auto 
                h-auto
                transition
                duration-500
                overflow-x-hidden
            "
        >
            <Image
                src="/images/bg.jpg"
                alt="bg"
                property="high"
                fill
                className="w-screen h-screen object-fill"
            />
            {children}
        </div>
    )
}

export default LoginUI