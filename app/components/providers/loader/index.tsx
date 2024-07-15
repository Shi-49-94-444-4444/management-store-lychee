"use client";

import { PulseLoader, RingLoader, FadeLoader } from "react-spinners";

interface LoadingProps {
    color?: string;
    loading: boolean;
    size?: number;
    height?: string
}

export function Loading({ color, loading, size }: LoadingProps) {
    return (
        <span
            className="flex gap-1 items-center justify-center h-[1.75rem]"
        >
            <PulseLoader
                color={color || "#FF6347"}
                loading={loading}
                size={size || 10}
                data-testid="loader"
            />
        </span>
    );
}

export function LoadingFullScreen({ color, loading, size, height }: LoadingProps) {
    return (
        <div className={`relative flex ${height || "h-80"}  items-center justify-center`}>
            <RingLoader
                color={color || "#FF6347"}
                loading={loading}
                size={size || 100}
                data-testid="loader"
            />
        </div>
    );
}

export function LoadingFadeSmall({ color, loading, size }: LoadingProps) {
    return (
        <span
            className="flex gap-1 items-center justify-center h-[1.75rem]"
        >
            <FadeLoader
                color={color || "#FF6347"}
                loading={loading}
                height={size || 15}
                width={size || 5}
                data-testid="loader"
            />
        </span>
    );
}

export function LoadingActionWallet({ color, loading, size }: LoadingProps) {
    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${loading ? 'bg-black bg-opacity-50 z-[99999]' : ''}`}>
            <FadeLoader
                color={color || "#FF6347"}
                loading={loading}
                height={size || 15}
                width={size || 5}
                data-testid="loader"
            />
        </div>
    );
}

export function LoadingActionPayment({ color, loading, size }: LoadingProps) {
    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${loading ? 'bg-black bg-opacity-50 z-[99999]' : ''}`}>
            <div className="flex flex-col gap-5 items-center justify-center bg-white rounded-lg p-10">
                <FadeLoader
                    color={color || "#FF6347"}
                    loading={loading}
                    height={size || 25}
                    margin={20}
                    width={size || 7}
                    radius={10}
                    data-testid="loader"
                />
                <div className="pt-5 text-3xl font-semibold text-black">Đang trong quá trình thanh toán</div>
                <div className="text-lg font-medium text-gray-500">Bạn vui lòng chờ trong giây lát, hệ thống đang chờ xử lý thanh toán của bạn</div>
            </div>
        </div>
    );
}