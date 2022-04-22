//登录方法
import request from "@/utils/request";

export function login(username, password, client_id, client_secret, grant_type, type) {
    let data = new FormData();
    data.append("username", username)
    data.append("password", password)
    data.append("client_id", client_id)
    data.append("client_secret", client_secret)
    data.append("grant_type", grant_type)
    data.append("type", type)

    return request({
        url: '/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            isToken: false
        },
        method: 'post',
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