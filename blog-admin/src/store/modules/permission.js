
import { constantRoutes } from '@/router'
import {getRouters} from "@/api/menu";


const permission = {
    state: {
        routes: [],
        addRoutes: [],
        defaultRoutes: [],
        topbarRouters: [],
        sidebarRouters: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        SET_DEFAULT_ROUTES: (state, routes) => {
            state.defaultRoutes = constantRoutes.concat(routes)
        },
        SET_TOPBAR_ROUTES: (state, routes) => {
            state.topbarRouters = routes
        },
        SET_SIDEBAR_ROUTERS: (state, routes) => {
            state.sidebarRouters = routes
        },
    },
    actions: {
        // 生成路由
        GenerateRoutes({ commit }) {
            return new Promise(resolve => {
                // 向后端请求路由数据
                getRouters().then(res => {
                    const sdata = JSON.parse(JSON.stringify(res.data))
                    resolve(sdata)
                })
            })
        }
    }
}
export const loadView = (view) => {
    //return () => require.ensure([], (require) => require(`../../views${view}`))
    //return resolve => require([`@/views${view}`], resolve)
    // 路由懒加载
    //return resolve => require([`@/views${view}`], resolve);
    return () => Promise.resolve(require(`@/views${view}`))
}

export default permission