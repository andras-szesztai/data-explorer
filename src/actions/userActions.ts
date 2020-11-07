import { CurrentUserObject } from "../types/user"

export const LOGIN_USER = "LOGIN_USER"
export const INITIALIZE_CURRENT_USER = "INITIALIZE_CURRENT_USER"

export const loginUser = (id: string) => {
  return { type: LOGIN_USER, payload: id } as const
}

export const addCurrentUser = (user: CurrentUserObject) => {
  return { type: INITIALIZE_CURRENT_USER, payload: user } as const
}