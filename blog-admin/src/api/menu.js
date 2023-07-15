// 获取路由
import request from "@/utils/request";

export const getRouters = () => {
    return request({
        url: '/user/admin-user/menus',
        method: 'get',
        headers: {
            isToken: true
        },
    })
}
// 查询菜单列表
export function listMenu(query) {
    return request({
        url: '/user/menu',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}
// 修改隐藏
export function changeHidden(query) {
    return request({
        url: '/user/hidden',
        method: 'post',
        headers: {
            isToken: true
        },
        params: query
    })
}
// 修改禁用
export function changeDisable(query) {
    return request({
        url: '/user/disable',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}

// 删除菜单
export function deleteMenu(query) {
    return request({
        url: '/user/menu/hidden',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}

// 添加或修改菜单
export function saveOrUpdateMenu(query) {
    return request({
        url: '/user/menu',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}