// 查询菜单列表
import request from "@/utils/request";

export function listComments(query) {
    return request({
        url: '/article/admin/comments',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}
// 修改禁用
export function updateCommentReview(query) {

    return request({
        url: '/article/admin/comments/review',
        method: 'put',
        headers: {
            isToken: true
        },
        data: query
    })
}

// 修改评论
export function deleteComments(query) {
    console.log(JSON.stringify(query))
    return request({
        url: '/article/admin/comments',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}