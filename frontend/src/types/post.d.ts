export interface IPost {
  id: number
  title: string
  content: string
  created: string
  modified?: string
}

export interface IPostCreate {
  title: string
  content: string
}

export interface IPostUpdate {
  title: string
  content: string
}
