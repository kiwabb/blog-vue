import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: import('../components/index.vue'),
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {name : '主页'},
        component: () => import('../views/home/Home.vue')
      },
      {
        path: '/article/:id?',
        name: 'add',
        meta: {name : '发布文章'},
        component: () => import('../views/article/Article.vue')
      },
      {
        path: '/articleList',
        name: 'list',
        meta: {name : '文章列表'},
        component: () => import('../views/article/ArticleList.vue')
      },
      {
        path: '/category',
        name: 'category',
        meta: {name : '分类管理'},
        component: () => import('../views/category/Category.vue')
      },
      {
        path: '/tag',
        name: 'tag',
        meta: {name : '标签管理'},
        component: () => import('../views/tag/Tag.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        meta: {name : '菜单管理'},
        component: () => import('../views/menu/Menu.vue')
      },
      {
        path: '/interface',
        name: 'interface',
        meta: {name : '接口管理'},
        component: () => import('../views/interface/Interface.vue')
      },
      {
        path: '/role',
        name: 'role',
        meta: {name : '角色管理'},
        component: () => import('../views/role/Role.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: {name : '用户管理'},
        component: () => import('../views/user/User.vue')
      },
      {
        path: '/admin-user',
        name: 'admin-user',
        meta: {name : '管理员用户管理'},
        component: () => import('../views/user/AdminUser.vue')
      },
      {
        path: '/side',
        name: 'side',
        component: () => import('../components/SideBar.vue')
      },
      {
        path: '/nav',
        name: 'nav',
        component: () => import('../components/NavBar.vue')
      },

    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { name : '登录'},
    hidden: true,
    component: () => import('../views/login/Login.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}
export default router
