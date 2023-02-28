import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import(/* webpackChunkName: "main" */ '@/views/AppRouter.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/main',
        name: 'Main',
        component: () => import('@/views/Main.vue'),
        children: [
          {
            path: '/main/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/Dashboard.vue'),
          },
          {
            path: '/main/profile/view',
            name: 'UserProfile',
            component: () => import('@/views/main/profile/UserProfile.vue'),
          },
          {
            path: '/main/profile/edit',
            name: 'UserProfileEdit',
            component: () => import('@/views/main/profile/UserProfileEdit.vue'),
          },
          {
            path: '/main/home',
            name: 'Home',
            component: () =>
              import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
