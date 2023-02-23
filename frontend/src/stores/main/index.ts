import { IUserProfile } from '@/types/profile'

export interface AppNotification {
  color?: string
  msg: string
  showProgress?: boolean
}

export interface AppState {
  token: string
  isLoggedIn: boolean | null
  loggedInError: boolean
  userProfile: IUserProfile | null
  showDrawer: boolean
  miniDrawer: boolean
  notifications: AppNotification[]
}
