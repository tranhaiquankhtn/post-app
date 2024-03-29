import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RouterComponent from '@/components/RouterComponent.vue'

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
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/ForgotPassword.vue'),
      },
      {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/ResetPassword.vue'),
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
            path: 'profile',
            component: RouterComponent,
            redirect: 'profile/view',
            children: [
              {
                path: 'view',
                component: () => import('@/views/main/profile/UserProfile.vue'),
              },
              {
                path: 'edit',
                component: () =>
                  import('@/views/main/profile/UserProfileEdit.vue'),
              },
              {
                path: 'password',
                component: () =>
                  import('@/views/main/profile/UserProfileChangePassword.vue'),
              },
            ],
          },
          {
            path: 'post',
            component: RouterComponent,
            redirect: 'post/view',
            children: [
              {
                path: 'view',
                component: () => import('@/views/main/post/Post.vue'),
              },
              {
                path: 'create',
                component: () => import('@/views/main/post/PostCreate.vue'),
              },
              {
                path: 'edit/:id',
                component: () => import('@/views/main/post/PostEdit.vue'),
              },
            ],
          },
          {
            path: 'admin',
            component: RouterComponent,
            redirect: 'admin/users',
            children: [
              {
                path: 'users',
                redirect: 'users/all',
              },
              {
                path: 'users/all',
                component: () => import('@/views/admin/AdminUsers.vue'),
              },
              {
                path: 'users/create',
                component: () => import('@/views/admin/CreateUser.vue'),
              },
              {
                path: 'users/edit/:id',
                component: () => import('@/views/admin/EditUser.vue'),
              },
            ],
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
