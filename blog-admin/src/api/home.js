import request from "@/utils/request";

export function getData() {
    return request({
        url: '/article/home',
        method: 'get',
        headers: {
            isToken: true
        },
    })
}