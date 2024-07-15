import currency from 'currency.js'
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';

export function formatCurrency(amount: number): string {
    return currency(amount, {
        symbol: '₫',
        separator: '.',
        decimal: ',',
        precision: 0,
    }).format();
};

export function formatNumber(num: number): string {
    if (num < 1000) {
        return num.toString();
    } else {
        const formattedNum = (num / 1000).toFixed(1);
        return formattedNum.endsWith('.0') ? `${Math.floor(num / 1000)}k` : `${formattedNum.replace('.', ',')}k`;
    }
};

export function removeVietnameseTones(str: string) {
    str = str.trim().toLowerCase()
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    return str
};

export function formatTime(str: string): string {
    const formattedDate = format(new Date(str), 'EEEE, MMMM dd, yyyy HH:mm:ss', { locale: vi });

    return formattedDate
};

export function formatShortTime(str: string): string {
    const formattedDate = format(new Date(str), 'dd/MM/yyyy HH:mm:ss', { locale: vi });

    return formattedDate;
};

export function formatNoTime(str: string): string {
    const formattedDate = format(new Date(str), 'dd/MM/yyyy', { locale: vi });

    return formattedDate;
};