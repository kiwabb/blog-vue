import request from "@/utils/request";

export function listCategories(query) {
    return request({
        url: '/article/admin/category/allCategory',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}

export function addOrEditCategory(query) {
    return request({
        url: '/article/admin/category/addCategory',
        method: 'put',
        headers: {
            isToken: true
        },
        data: query
    })
}

export function deleteCategory(query) {
    return request({
        url: '/article/admin/category/deleteCategory',
        method: 'delete',
        headers: {
            isToken: true
        },
        data: query
    })
}