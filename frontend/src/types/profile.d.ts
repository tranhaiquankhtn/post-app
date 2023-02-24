export interface IUserProfile {
    email: string
    isActive: boolean
    isSuperUser: boolean
    fullName: string
    id: number
}

export interface IUserProfileCreate {
    email?: string
    fullName?: string
    password: string
    isActive?: boolean
    isSuperUser?: boolean
}

export interface IUserProfileUpdate {
    email?: string
    fullName?: string
    password?: string
    isActive?: string
    isSuperUser?: string
}
