import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/discover',
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'discover',
        name: 'Discover',
        component: () => import('@/views/Discover/index.vue'),
        meta: { title: '发现音乐' },
      },
      {
        path: 'my-music',
        name: 'MyMusic',
        component: () => import('@/views/MyMusic/index.vue'),
        meta: { title: '我的音乐' },
      },
      {
        path: 'ranking',
        name: 'Ranking',
        component: () => import('@/views/Ranking/index.vue'),
        meta: { title: '排行榜' },
      },
      {
        path: 'singers',
        name: 'Singers',
        component: () => import('@/views/Singers/index.vue'),
        meta: { title: '歌手' },
      },
      {
        path: 'albums',
        name: 'Albums',
        component: () => import('@/views/Albums/index.vue'),
        meta: { title: '专辑' },
      },
      {
        path: 'playlist',
        name: 'Playlist',
        component: () => import('@/views/Playlist/index.vue'),
        meta: { title: '歌单' },
      },
      {
        path: 'playlist/:id',
        name: 'PlaylistDetail',
        component: () => import('@/views/Playlist/Detail.vue'),
        meta: { title: '歌单详情' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile/index.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - QQ音乐`
  }
  next()
})

export default router
