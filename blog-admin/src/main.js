import { createApp, defineComponent, ref } from 'vue'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import ElMessage from "element-plus";
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import "./assets/css/index.css";
import './assets/iconfont/iconfont.css'
import moment from "moment"
//createApp(App).use(ElementPlus).use(store).use(router).mount('#app')
const app = createApp(App);
app.use(ElementPlus).use(ElementPlus).use(store).use(router);
app.config.globalProperties.$filters = {
    dateFormat(value, formatStr="YYYY-MM-DD") {
        return moment(value).format(formatStr);
    }
}
app.config.globalProperties.$axios = axios
axios.defaults.baseURL = '/api';
app.mount('#app');
