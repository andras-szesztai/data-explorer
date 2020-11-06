import { loginUser, LOGIN_USER } from "../actions/userActions"

export const initialUserState = { isAuthenticated: false, userId: "" }

export type UserActions = ReturnType<typeof loginUser>

export const userReducer = (state = initialUserState, action: UserActions) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload,
      }
    default:
      return state
  }
}
