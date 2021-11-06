import { createStore } from 'vuex'
import moment from "moment";

export default createStore({
  state: {
    collapse: false,
    tabList: [{ name: "index", path: "/", mate: '主页' }],
    userId: null,
    roleList: null,
    avatar: null,
    nickname: null,
    intro: null,
    webSite: null,
    userMenuList: []
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
  },
  actions: {

  },
  modules: {
  },
})
