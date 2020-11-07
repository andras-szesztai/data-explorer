import React from "react"
import styled from "styled-components"
import { Route, BrowserRouter, Switch } from "react-router-dom"

import { ProtectedRoute, Dashboard, Login, Confirmation } from "./components"

import {
  initialUserState,
  UserActions,
  userReducer,
} from "./reducers/userReducer"

import { useInitializeUser, useSyncSavedViews } from "./hooks"
import { UserState } from "./types/user"

import "./styles/App.less"

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

  useInitializeUser({ userState, updateUserState })
  useSyncSavedViews(userState)

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
