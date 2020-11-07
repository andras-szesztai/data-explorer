export interface UserState {
  isAuthenticated: boolean
  userId: string
  currentUser: CurrentUserObject
}

export interface CurrentUserObject {
  [key: string]: string | SamenHierObject
  id: string
  samenHier: SamenHierObject
}

export interface SamenHierObject {
  savedViews: { [title: string]: SavedViewObject }
}

export interface SavedViewObject {
  id: string
  date: Date
  lastActive: Date
  filters: string
  charts: string
  dataSet: string
}
