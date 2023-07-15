import {getToken, removeToken, setToken} from "@/utils/auth";
import {getInfo, login, logout} from "@/api/login";

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    actions: {
        //登录
        Login({commit}, userInfo) {
            const username = userInfo.username.trim();
            const password = userInfo.password;
            const client_id = 'web-client';
            const client_secret = 'admin';
            const grant_type = 'password';
            const type = 0;
            return new Promise(((resolve, reject) => {
                login(username, password, client_id, client_secret, grant_type, type).then(res => {
                    setToken(res.access_token)
                    commit('SET_TOKEN', res.access_token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            }))
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.data
                    const avatar = user.avatar;
//{"msg":"success","code":0,"data":{"id":"1","username":"admin","password":null,"avatar":null,"email":"111@qq.com","roleList":["ROLE_admin"],"isDisable":0,"accountNonExpired":true,"accountNonLocked":true,"credentialsNonExpired":true,"authorities":[{"authority":"ROLE_admin"}],"enabled":true}}
                    if (user.roleList && user.roleList.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', user.roleList)
                        commit('SET_PERMISSIONS', null)
                    } else {
                        commit('SET_ROLES', ['ROLE_DEFAULT'])
                    }
                    commit('SET_NAME', user.username)
                    commit('SET_AVATAR', avatar)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 退出系统
        LogOut({ commit}) {
            return new Promise((resolve, reject) => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                commit('SET_PERMISSIONS', [])
                removeToken()
                resolve()
                // logout(state.token).then(() => {
                //
                // }).catch(error => {
                //     reject(error)
                // })
            })
        },
    }
}
export default user