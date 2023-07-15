import request from "@/utils/request";

export function changeTop(query) {
    return request({
        url: '/article/admin/top',
        method: 'put',
        headers: {
            isToken: true
        },
        data: query
    })
}

export function logicDeleteArticle(query) {
    return request({
        url: '/article/admin/logicDelete',
        method: 'delete',
        headers: {
            isToken: true
        },
        data: query
    })
}

export function listArticles(query) {
    return request({
        url: '/article/admin',
        method: 'get',
        headers: {
            isToken: true
        },
        params: query
    })
}

export function getArticleInfo(articleId) {
    return request({
        url: '/article/admin/' + articleId,
        method: 'get',
        headers: {
            isToken: true
        }
    })
}

export function saveArticle(query) {
    return request({
        url: '/article/admin',
        method: 'post',
        headers: {
            isToken: true
        },
        data: query
    })
}