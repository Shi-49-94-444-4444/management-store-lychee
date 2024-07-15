import { InputProps } from "@/types";

const Input: React.FC<InputProps> = ({
    id = "",
    icon,
    IconType,
    label,
    name,
    placeholder,
    value,
    type,
    register,
    disabled,
    errors,
    onChange,
    colorInput,
    pattern,
    flagInput,
    rowArea,
    maxLength,
    isMoney,
    defaultValue
}) => {
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (isMoney) {
            let value = event.target.value
            event.target.type = 'text'
            event.target.value = Number(value).toLocaleString('vi-VN')
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(event)
        }
    }

    const registerProps = register ? register(name) : {}

    return (
        <div className="gap-1 transition duration-300">
            {label && (
                <label htmlFor={id} className="block text-left text-base font-semibold text-black mb-1">
                    {label}
                </label>
            )}
            <div className="relative flex items-center  ">
                {icon && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white-cus">
                        {icon}
                    </span>
                )}
                {IconType && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white-cus">
                        <IconType size={25} />
                    </span>
                )}
                {onChange ? (
                    flagInput ? (
                        <textarea
                            id={id}
                            typeof={type}
                            rows={rowArea || 5}
                            maxLength={maxLength || 1000}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            placeholder={placeholder}
                            {...registerProps}
                            disabled={disabled}
                            onChange={handleChange}
                            className={`
                                ${colorInput}
                                w-full 
                                rounded-lg 
                                outline-none
                                focus:ring-0
                                text-base
                                py-3    
                                px-6
                                transition
                                duration-300
                                ${errors && errors[id] ? "border border-red-500" : ""}
                            `}
                            pattern={pattern?.source}
                        />
                    ) : (
                        <input
                            id={id}
                            type={type}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            placeholder={placeholder}
                            {...registerProps}
                            disabled={disabled}
                            onChange={handleChange}
                            maxLength={maxLength || 200}
                            className={`
                                ${colorInput}
                                w-full 
                                rounded-lg 
                                outline-none
                                focus:ring-0
                                text-base
                                py-3    
                                px-6
                                transition
                                duration-300
                                ${errors && errors[id] ? "border border-red-500" : ""}
                                ${disabled && disabled ? "cursor-not-allowed" : ""}
                            `}
                            pattern={pattern?.source}
                            onBlur={handleBlur}
                        />
                    )
                ) : (
                    flagInput ? (
                        <textarea
                            id={id}
                            typeof={type}
                            rows={rowArea || 5}
                            maxLength={maxLength || 1000}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            placeholder={placeholder}
                            {...registerProps}
                            disabled={disabled}
                            className={`
                                ${colorInput}
                                w-full 
                                rounded-lg 
                                outline-none
                                focus:ring-0
                                text-base
                                py-3    
                                px-6
                                transition
                                duration-300
                                ${errors && errors[id] ? "border border-red-500" : ""}
                            `}
                            pattern={pattern?.source}
                        />
                    ) : (
                        <input
                            id={id}
                            type={type}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            placeholder={placeholder}
                            {...registerProps}
                            disabled={disabled}
                            maxLength={maxLength || 200}
                            className={`
                                ${colorInput}
                                w-full 
                                rounded-sm 
                                outline-none
                                focus:ring-0
                                text-base
                                py-2
                                px-4
                                transition
                                duration-300
                                ${errors && errors[id] ? "border border-red-500" : ""}
                                ${disabled && disabled ? "cursor-not-allowed" : ""}
                            `}
                            pattern={pattern?.source}
                            onBlur={handleBlur}
                            autoComplete="off"
                        />
                    )
                )}
                {isMoney && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
                        VND
                    </span>
                )}
            </div>
            {errors && (
                <p className="text-red-500 font-medium h-2 text-left">
                    {errors[id]?.message?.toString()}
                </p>
            )}
        </div>
    );
};

export default Input;
