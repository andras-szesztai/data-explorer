import React from "react"
import styled from "styled-components"
import { Route, BrowserRouter, Switch } from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Dashboard from "./components/Dashboard/Dashboard"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"

import {
  initialUserState,
  UserActions,
  userReducer,
} from "./reducers/userReducer"

import { UserState } from "./types/user"

import "./styles/App.less"
import Confirmation from "./components/Confirmation/Confirmation"

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
  return (
    <UserDispatchContext.Provider value={updateUserState}>
      <UserStateContext.Provider value={userState}>
        <MainContainer>
          <BrowserRouter>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
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
