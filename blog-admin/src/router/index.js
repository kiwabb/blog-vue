import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'index',
    meta: {name : '主页'},
    component: () => import('../views/home/Home.vue')
  },
  {
    path: '/article',
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
    path: '/side',
    name: 'side',
    component: () => import('../components/SideBar.vue')
  },
  {
    path: '/nav',
    name: 'nav',
    component: () => import('../components/NavBar.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
