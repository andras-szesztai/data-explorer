import React from "react"
import styled from "styled-components"
import { Route, BrowserRouter, Switch } from "react-router-dom"
import isEmpty from "lodash/isEmpty"
import { message } from "antd"

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Dashboard from "./components/Dashboard/Dashboard"
import Login from "./components/Login/Login"
import Confirmation from "./components/Confirmation/Confirmation"

import { db } from "./firebase"
import {
  initialUserState,
  UserActions,
  userReducer,
} from "./reducers/userReducer"

import { CurrentUserObject, UserState } from "./types/user"

import "./styles/App.less"
import { addCurrentUser } from "./actions/userActions"

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
  user-select: none;
`

export const UserStateContext = React.createContext({} as UserState)
export const UserDispatchContext = React.createContext(
  {} as React.Dispatch<UserActions>
)

const App = () => {
  const [userState, updateUserState] = React.useReducer(
    userReducer,
    initialUserState
  )

  React.useEffect(() => {
    const getUserObject = async () => {
      try {
        const doc = db.collection("users").doc(userState.userId)
        const user = await doc.get()
        if (user.exists) {
          const currentUser = user.data()
          if (currentUser) {
            updateUserState(addCurrentUser(currentUser as CurrentUserObject))
          }
        } else {
          doc.set({
            id: userState.userId,
            samenHier: {
              savedViews: [],
            },
          })
        }
      } catch (err) {
        message.error(err.message)
      }
    }
    if (userState.userId && isEmpty(userState.currentUser)) {
      getUserObject()
    }
  }, [userState])

  return (
    <UserDispatchContext.Provider value={updateUserState}>
      <UserStateContext.Provider value={userState}>
        <MainContainer>
          <BrowserRouter>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/confirmation" component={Confirmation} />
              <ProtectedRoute path="/" component={Dashboard} />
            </Switch>
          </BrowserRouter>
        </MainContainer>
      </UserStateContext.Provider>
    </UserDispatchContext.Provider>
  )
}

export default App
