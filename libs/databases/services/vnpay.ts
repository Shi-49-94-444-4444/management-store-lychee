import crypto from 'crypto';
import querystring from 'qs';
import { vnpayConfig } from '../config/vnpay';

export const vnpayCreatePayment = (transactionId: string, amount: number): string => {
    const { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = vnpayConfig;
    const createDate = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14);
    const orderId = transactionId;

    const data: Record<string, string | number> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode,
        vnp_Amount: amount * 100,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Transaction ${orderId}`,
        vnp_OrderType: 'other',
        vnp_Locale: 'vn',
        vnp_ReturnUrl,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: createDate,
    };

    const vnp_param = sortObject(data)

    const signData = querystring.stringify(vnp_param, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_param["vnp_SecureHash"] = signed
    const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_param, { encode: false })}`;
    

    return paymentUrl;
};

export const vnpayVerifyPayment = (query: any) => {
    const { vnp_HashSecret } = vnpayConfig;

    const vnp_SecureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const vnp_query = sortObject(query)

    const signData = querystring.stringify(vnp_query, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return vnp_SecureHash === signed;
};

function sortObject(obj: any) {
    let sorted: any = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
