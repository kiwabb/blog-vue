// 添加或修改菜单
import request from "@/utils/request";
//查询所有接口
export function listResources(query) {
    return request({
        url: '/user/interface',
        method: 'get',
        params: query
    })
}
//修改接口
export function changeResource(query) {
    return request({
        url: '/user/interface',
        method: 'put',
        data: query
    })
}
//删除
export function deleteResource(id) {
    return request({
        url: '/user/interface/' + id,
        method: 'delete',
    })
}

//删除
export function addOrEditResource(data) {
    return request({
        url: '/user/interface/',
        method: 'post',
        data: data
    })
}