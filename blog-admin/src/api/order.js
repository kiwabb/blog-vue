import request from "@/utils/request";

export function listOrders(query) {
    return request({
        url: '/shop/order',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}