import {
  addCurrentUser,
  loginUser,
  LOGIN_USER,
  INITIALIZE_CURRENT_USER,
} from "../actions/userActions"

import { CurrentUserObject, UserState } from "../types/user"

export const initialUserState = {
  isAuthenticated: true,
  userId: "51uq0KXEQYNgkW1nDqBJC0KagHT251uq0KXEQYNgkW1nDqBJC0KagHT2",
  currentUser: {} as CurrentUserObject,
}

export type UserActions = ReturnType<typeof loginUser | typeof addCurrentUser>

export const userReducer = (state: UserState, action: UserActions) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload,
      }
    case INITIALIZE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      }
    default:
      return state
  }
}
