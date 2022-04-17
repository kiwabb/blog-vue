//登录方法
import request from "@/utils/request";

export function login(username, password, client_id, client_secret, grant_type) {
    const data = {
        username,
        password,
        client_id,
        client_secret,
        grant_type
    }
    return request({
        url: '/oauth/token',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}
// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}
// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}