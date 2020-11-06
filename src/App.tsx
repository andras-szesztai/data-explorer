import React from "react"
import styled from "styled-components"
import { Route, BrowserRouter, Switch } from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Dashboard from "./components/Dashboard/Dashboard"
import Login from "./components/Login/Login"

import {
  initialUserState,
  UserActions,
  userReducer,
} from "./reducers/userReducer"

import "./styles/App.less"

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
  user-select: none;
`

export const UserStateContext = React.createContext({})
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
              <ProtectedRoute path="/" component={Dashboard} />
            </Switch>
          </BrowserRouter>
        </MainContainer>
      </UserStateContext.Provider>
    </UserDispatchContext.Provider>
  )
}

export default App
