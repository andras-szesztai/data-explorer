import React from "react"
import { Redirect, Route } from "react-router-dom"
import { UserStateContext } from "../../App"

interface Props {
  component: () => JSX.Element
  path: string
}
const ProtectedRoute = ({ component, path }: Props) => {
  const userState = React.useContext(UserStateContext)
  console.log("ProtectedRoute -> userState", userState)
  const isAuthenticated = false

  return isAuthenticated ? (
    <Route path={path} component={component} exact={true} />
  ) : (
    <Redirect to={{ pathname: "/login" }} />
  )
}

export default ProtectedRoute
