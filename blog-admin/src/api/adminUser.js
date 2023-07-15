// 修改禁用
import request from "@/utils/request";

export function changeDisable(query) {
    return request({
        url: '/user/users/disable',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}

export function editUserRole(query) {
    return request({
        url: '/user/admin-user',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}

export function listAdminUsers(query) {
    return request({
        url: '/user/admin-user',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}