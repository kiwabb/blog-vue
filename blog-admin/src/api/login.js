//登录方法
import request from "@/utils/request";

export function login(username, password, client_id, client_secret, grant_type, type) {
    let data = new FormData();
    data.append("username", username)
    data.append("password", password)
    data.append("type", type)

    let basicAuth = 'Basic ' + window.btoa('web-client:admin')

    return request({
        url: '/oauth/token',
        headers: {
            Authorization: basicAuth,
            isToken: false
        },
        method: 'post',
        params: {grant_type},
        data: data
    })
}
// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/user/admin-user/info',
        method: 'get',
        headers: {
            isToken: true
        }
    })
}
// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}