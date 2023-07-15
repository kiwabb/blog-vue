import request from "@/utils/request";

export function listShops(query) {
    return request({
        url: '/shop/shop',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}

export function createShop(data) {
    return request({
        url: '/shop/shop',
        method: 'post',
        headers: {
            isToken: true
        },
        data: data
    })
}

export function deleteShop(data) {
    return request({
        url: '/shop/shop/' + data,
        method: 'delete',
        headers: {
            isToken: true
        }
    })
}