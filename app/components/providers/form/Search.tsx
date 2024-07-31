import { BiSearch } from "react-icons/bi";

interface SearchProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: string;
}

const Search: React.FC<SearchProps> = ({ value, onChange, style }) => {
    return (
        <div className={`relative flex items-center w-full h-full ${style}`}>
            <input
                type="text"
                className="
                    w-full 
                    px-4 
                    py-2 
                    md:text-xl 
                    border 
                    border-black 
                    border-opacity-10 
                    bg-[#F7F7F7] 
                    rounded-md 
                    focus:ring-0 
                    focus:outline-none
                "
                placeholder="Tìm kiếm"
                value={value}
                onChange={onChange}
            />
            <div className="absolute top-2 right-3">
                <BiSearch size={30} />
            </div>
        </div>
    );
};

export default Search;
