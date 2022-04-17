import NProgress from 'nprogress'
import router from "@/router";
import {getToken} from "@/utils/auth";
import store from "@/store";
import {isReLogin} from "@/utils/request";
import {isHttp} from "@/utils/validate";
import {ElMessage} from "element-plus";

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/auth-redirect', '/bind', '/register'];

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
        /* has token*/
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            if (store.getters.role.length === 0) {
                isReLogin.show = false;
                store.dispatch('GetInfo').then(() => {
                    isReLogin = true;
                    store.dispatch('GenerateRoutes').then(accessRoutes => {
                        accessRoutes.forEach(route => {
                            if (!isHttp(route.path)) {
                                route.addRoute(route)
                            }
                        })
                        next({...to, replace: true})
                    })
                }).catch(error => {
                    store.dispatch('LogOut').then(() => {
                        ElMessage.error(error)
                        next({path: '/'})
                    })
                })
            } else {
                next()
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})
router.afterEach(() => {
    NProgress.done()
})