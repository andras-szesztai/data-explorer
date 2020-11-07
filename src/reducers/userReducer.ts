import { v4 as uuidv4 } from "uuid"

import {
  addCurrentUser,
  loginUser,
  LOGIN_USER,
  INITIALIZE_CURRENT_USER,
  addNewView,
  ADD_NEW_VIEW,
} from "../actions/userActions"

import { CurrentUserObject, UserState } from "../types/user"

export const initialUserState = {
  isAuthenticated: true,
  userId: "51uq0KXEQYNgkW1nDqBJC0KagHT251uq0KXEQYNgkW1nDqBJC0KagHT2",
  currentUser: {} as CurrentUserObject,
}

export type UserActions = ReturnType<
  typeof loginUser | typeof addCurrentUser | typeof addNewView
>

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
    case ADD_NEW_VIEW:
      const currProject = state.currentUser[action.payload.projectAccessor]
      if (typeof currProject != "string") {
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            [action.payload.projectAccessor]: {
              ...currProject,
              savedViews: {
                ...currProject.savedViews,
                [action.payload.viewId]: {
                  id: uuidv4(),
                  date: new Date(),
                  filters: action.payload.filters,
                  charts: action.payload.charts,
                },
              },
            },
          },
        }
      } else {
        return state
      }
    default:
      return state
  }
}
