import request from "@/utils/request";

export function listRoles(query) {
    return request({
        url: '/user/role',
        method: 'get',
        params: query
    })
}

export function listInterfaces() {
    return request({
        url: '/user/interface/role/interfaces',
        method: 'get',
    })
}
export function listMenus() {
    return request({
        url: '/user/menu/role/menus',
        method: 'get',
    })
}

export function deleteRoles(query) {
    return request({
        url: '/user/role',
        method: 'delete',
        params: query
    })
}

export function saveOrUpdateRoleResource(query) {
    return request({
        url: '/user/role',
        method: 'post',
        data: query
    })
}

export function saveOrUpdateRoleMenu(query) {
    return request({
        url: '/user/role',
        method: 'post',
        data: query
    })
}
