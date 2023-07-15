import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import "./assets/css/index.css";
import './assets/iconfont/iconfont.css'
import moment from "moment"
import ECharts from 'vue-echarts'
import { use } from "echarts/core";

//cookies
//md
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
//axios请求
import request from "@/axios";
import Prism from 'prismjs';
import NProgress from "_nprogress@0.2.0@nprogress";
import {getToken} from "@/utils/auth";
import {ElMessage} from "_element-plus@1.1.0-beta.24@element-plus";
import Layout from "@/layout";
import {loadView} from "@/store/modules/permission";

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

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
            if (store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(() => {
                    store.dispatch('GenerateRoutes').then(res => {
                        res.forEach(item => {
                            if (item.icon != null) {
                                item.icon = "iconfont " + item.icon;
                            }
                            if (item.component === 'Layout') {
                                item.component = Layout;
                            }
                            if (item.children && item.children.length > 0) {
                                item.children.forEach(route => {
                                    route.icon = "iconfont " + route.icon;
                                    route.hidden = route.isHidden
                                    route.component = loadView(route.component);
                                    router.addRoute(route);
                                });
                            }
                        });
                        console.log(res)

                        store.commit('SET_ROUTES', res)
                        next({...to, replace: true})
                    })
                }).catch(error => {
                    console.log(error)
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

//createApp(App).use(ElementPlus).use(store).use(router).mount('#app')
const app = createApp(App);
app.use(ElementPlus).use(ElementPlus).use(store).use(router).use(VueMarkdownEditor);
app.config.globalProperties.$filters = {
    dateFormat(value, formatStr="YYYY-MM-DD") {
        return moment(value).format(formatStr);
    },
    timeDateFormat(value, formatStr="YYYY-MM-DD hh:mm:ss") {
        return moment(value).format(formatStr);
    }
}
app.component('v-chart', ECharts)
app.config.globalProperties.$axios = request
app.mount('#app');
