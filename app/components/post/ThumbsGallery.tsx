"use client"

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Thumbs } from 'swiper/modules';
import { useDropzone } from 'react-dropzone';

import 'swiper/css';
import 'swiper/css/thumbs';
import Image from 'next/image';
import { FcAddImage } from 'react-icons/fc';

const ThumbGallery = ({ setImage }: { setImage: React.Dispatch<React.SetStateAction<string>> }) => {
    const maxSize = 2097152;
    const thumbsSwiperRef = useRef<SwiperCore | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 1) {
                const file = acceptedFiles[0];
                if (file.size <= maxSize) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                            const base64data = reader.result;
                            setUploadedImage(base64data);
                            setImage(base64data);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    console.log('File quá lớn!');
                }
            }
        },
        multiple: false,
    });

    return (
        <Swiper
            modules={[Thumbs]}
            thumbs={{ swiper: thumbsSwiperRef.current }}
            slidesPerView={1}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
        >
            {uploadedImage ? (
                <SwiperSlide>
                    <div
                        className="relative transition-all pb-[70%] duration-500 cursor-pointer"
                        onClick={open}
                    >
                        <div className="absolute top-0 left-0 w-full h-full transition duration-300">
                            <Image
                                src={uploadedImage}
                                alt="Uploaded Image"
                                className="rounded-lg object-cover w-full h-full border border-black border-opacity-10"
                                sizes="(max-width: 600px) 100vw, 600px"
                                fill
                            />
                        </div>
                    </div>
                </SwiperSlide>
            ) : (
                <div
                    {...getRootProps()}
                    className="relative border-2 border-dashed h-96 rounded-xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-3 px-5"
                >
                    <input {...getInputProps()} />
                    <div className="relative w-20 h-20 flex justify-center items-center bg-[#F5FAFF] rounded-full">
                        <FcAddImage size={40} />
                    </div>
                    <div className="text-2xl whitespace-nowrap space-x-1 text-gray-600">
                        Thả hình ảnh của bạn ở đây
                    </div>
                    <p className="text-gray-500 text-xl text-center">Tải hình ảnh lên định dạng jpg, png dung lượng tối đa 2MB</p>
                </div>
            )}
        </Swiper>
    );
};

export default ThumbGallery;
