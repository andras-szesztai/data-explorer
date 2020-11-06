import React from "react"
import styled from "styled-components"
import { Route, BrowserRouter, Switch } from "react-router-dom"

import { auth } from "./firebase"

import Dashboard from "./components/Dashboard/Dashboard"
// + import Settings from './Settings';

import "./styles/App.less"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Login from "./components/Login/Login"

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
  user-select: none;
`

const App = () => {
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const { user } = await auth.signInWithEmailAndPassword(
          "andras@test.com",
          "123456"
        )
        console.log(user?.email)
        console.log(user?.uid)
        // generateUserDocument(user, { displayName })
      } catch (error) {
        console.log("App -> error", error)
        // setError("Error Signing up with email and password")
      }
    }
    getUser()
  }, [])

  return (
    <MainContainer>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </MainContainer>
  )
}

export default App
