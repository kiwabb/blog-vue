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
//md
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import Prism from 'prismjs';
VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

//createApp(App).use(ElementPlus).use(store).use(router).mount('#app')
const app = createApp(App);
app.use(ElementPlus).use(ElementPlus).use(store).use(router).use(VueMarkdownEditor);
app.config.globalProperties.$filters = {
    dateFormat(value, formatStr="YYYY-MM-DD") {
        return moment(value).format(formatStr);
    }
}
app.config.globalProperties.$axios = axios
app.mount('#app');
