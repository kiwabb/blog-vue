import request from "@/utils/request";

export function listTags(query) {
    return request({
        url: '/article/tag/admin/allTag',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}

export function deleteTag(query) {
    return request({
        url: '/article/admin/tag/deleteTag',
        method: 'delete',
        headers: {
            isToken: true
        },
        data: query
    })
}
export function addOrEditTag(query) {
    return request({
        url: '/article/admin/tag/addTag',
        method: 'put',
        headers: {
            isToken: true
        },
        data: query
    })
}