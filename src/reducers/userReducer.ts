import { v4 as uuidv4 } from "uuid"
import { omit } from "lodash"

import {
  addCurrentUser,
  loginUser,
  LOGIN_USER,
  INITIALIZE_CURRENT_USER,
  addNewView,
  ADD_NEW_VIEW,
  updateViewLastActive,
  UPDATE_VIEW_LAST_ACTIVE,
  deleteView,
  DELETE_SAVED_VIEW,
} from "../actions/userActions"

import { CurrentUserObject, UserState } from "../types/user"

export const initialUserState = {
  isAuthenticated: false,
  userId: "",
  currentUser: {} as CurrentUserObject,
}

export type UserActions = ReturnType<
  | typeof loginUser
  | typeof addCurrentUser
  | typeof addNewView
  | typeof updateViewLastActive
  | typeof deleteView
>

export const userReducer = (state: UserState, action: UserActions) => {
  let currProject
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
      currProject = state.currentUser[action.payload.projectAccessor]
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
                  lastActive: new Date(),
                  filters: action.payload.filters,
                  charts: action.payload.charts,
                  dataSet: action.payload.dataSet,
                  title: action.payload.title,
                },
              },
            },
          },
        }
      } else {
        return state
      }
    case DELETE_SAVED_VIEW:
      currProject = state.currentUser[action.projectAccessor]
      if (typeof currProject !== "string") {
        const newViews = omit(currProject.savedViews, action.viewId)
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            [action.projectAccessor]: {
              ...currProject,
              savedViews: newViews,
            },
          },
        }
      } else {
        return state
      }
    case UPDATE_VIEW_LAST_ACTIVE:
      currProject = state.currentUser[action.projectAccessor]
      if (typeof currProject !== "string") {
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            [action.projectAccessor]: {
              ...currProject,
              savedViews: {
                ...currProject.savedViews,
                [action.viewId]: {
                  ...currProject.savedViews[action.viewId],
                  lastActive: new Date(),
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
