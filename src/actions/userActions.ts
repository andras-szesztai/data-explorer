import { CurrentUserObject } from "../types/user"

export const LOGIN_USER = "LOGIN_USER"
export const INITIALIZE_CURRENT_USER = "INITIALIZE_CURRENT_USER"
export const ADD_NEW_VIEW = "ADD_NEW_VIEW"

export const loginUser = (id: string) => {
  return { type: LOGIN_USER, payload: id } as const
}

export const addCurrentUser = (user: CurrentUserObject) => {
  return { type: INITIALIZE_CURRENT_USER, payload: user } as const
}

export const addNewView = ({
  projectAccessor,
  filters,
  charts,
  viewId,
  dataSet,
  title,
}: {
  projectAccessor: string
  filters: string
  charts: string
  viewId: string
  dataSet: string
  title: string
}) => {
  return {
    type: ADD_NEW_VIEW,
    payload: { projectAccessor, filters, charts, viewId, dataSet, title },
  } as const
}
