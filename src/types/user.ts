export interface UserState {
  isAuthenticated: boolean
  userId: string
  currentUser: CurrentUserObject
}


export interface CurrentUserObject {
  id: string
  samenHier: SamenHierObject
}

export interface SamenHierObject {
  savedViews: SavedViewObject[]
}

export interface SavedViewObject {
  id: string
  date: Date
}