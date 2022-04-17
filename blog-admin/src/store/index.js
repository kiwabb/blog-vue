import { createStore } from 'vuex'
import user from './modules/user'
import getters from "@/store/getters";
import settings from "@/store/modules/settings";
import permission from "@/store/modules/permission";

const store = createStore({

  state: {
    collapse: false,
    tabList: [{ name: "index", path: "/", mate: '主页' }],
    userId: null,
    roleList: null,
    avatar: null,
    nickname: null,
    intro: null,
    webSite: null,
    userMenuList: [],
    token: ''
  },
  mutations: {
    saveTab(state, tab) {
      if (state.tabList.findIndex(item => item.path === tab.path) === -1) {
        state.tabList.push({ name: tab.name, path: tab.path });
      }
    },
    trigger(state) {
      state.collapse = !state.collapse;
    },
    setToken(state, token) {
      state.token = token
      localStorage.setItem("token", token)
    }
  },
  actions: {

  },
  modules: {
    user,
    settings,
    permission
  },
  getters
});

export default store
