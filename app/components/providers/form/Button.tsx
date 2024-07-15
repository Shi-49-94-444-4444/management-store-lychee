import { ButtonProps } from "@/types"

const Button: React.FC<ButtonProps> = ({
    title,
    style,
    onClick,
    icon,
    iconLeft,
    type,
    disabled = false,
    isHover = true,
    color,
    text
}) => {
    return (
        <button className={`
                relative
                flex
                ${text || "text-white"} 
                ${color || "bg-primary-cus"}
                ${isHover ? `${color || "hover:text-primary-blue-cus hover:border-primary-cus hover:bg-red-500 hover:border"}` : ""}
                ${disabled ? "cursor-not-allowed" : ""}
                border
                ${color || "border-primary-cus"}
                text-center
                items-center
                font-semibold
                py-2
                px-10
                rounded-lg
                transition
                duration-500
                group
                ${style}    
            `}
            type={type || "button"}
            onClick={onClick}
            disabled={disabled}
        >
            {iconLeft && (
                <span className="mr-3 text-white group-hover:text-primary-blue-cus">
                    {iconLeft}
                </span>
            )}
            {title}
            {icon && (
                <span className="ml-3 text-white group-hover:text-primary-blue-cus">
                    {icon}
                </span>
            )}
        </button>
    )
}

export default Button