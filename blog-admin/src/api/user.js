import request from "@/utils/request";

export function listUsers(query) {
    return request({
        url: '/user/user',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}

export function changeDisable(query) {
    return request({
        url: '/user/user',
        method: 'put',
        headers: {
            isToken: true
        },
        data: query
    })
}