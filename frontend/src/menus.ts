import { IMenuGroup } from '@/types/menu'

export const menus: IMenuGroup[] = [
  {
    header: 'Main',
    children: [
      {
        icon: 'mdi-view-dashboard',
        title: 'Dashboard',
        link: '/main/dashboard',
      },
      {
        icon: 'mdi-account',
        title: 'Profile',
        link: '/main/profile/view',
      },
      {
        icon: 'mdi-account-edit',
        title: 'Edit Profile',
        link: '/main/profile/edit',
      },
      {
        icon: 'mdi-account-key',
        title: 'Change Password',
        link: '/main/profile/password',
      },
    ],
  },
  {
    header: 'Post',
    children: [
      {
        icon: 'mdi-file-document-multiple-outline',
        title: 'Post',
        link: '/main/post/view',
      },
      {
        icon: 'mdi-file-plus-outline',
        title: 'Create Post',
        link: '/main/post/create',
      },
    ],
  },
  {
    header: 'Admin',
    children: [
      {
        icon: 'mdi-account-group',
        title: 'Manage Users',
        link: '/main/admin/users/all',
      },
      {
        icon: 'mdi-account-plus',
        title: 'Create User',
        link: '/main/admin/users/create',
      },
    ],
  },
]
