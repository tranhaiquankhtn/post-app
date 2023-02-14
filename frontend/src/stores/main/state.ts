import { IUserProfile } from '@/types/profile'

export interface AppState {
  token: string;
  isLoggedIn: boolean | null;
  loggedInError: boolean;
  userProfile: IUserProfile | null;
  showDrawer: boolean;
  miniDrawer: boolean;
}
