import { Spin } from "antd"
import React from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { loginUser } from "../../actions/userActions"
import { UserDispatchContext, UserStateContext } from "../../App"
import { auth } from "../../firebase"

const SpinnerContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

function Confirmation() {
  const updateUserState = React.useContext(UserDispatchContext)
  const isInit = React.useRef(false)
  const history = useHistory()
  React.useEffect(() => {
    if (!isInit.current) {
      isInit.current = true
      if (auth.isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn")
        if (email) {
          auth
            .signInWithEmailLink(email, window.location.href)
            .then(function (result) {
              window.localStorage.removeItem("emailForSignIn")
              if (result.user) {
                updateUserState(loginUser())
                history.push("/")
              }
            })
            .catch(function (error) {
              console.error("Confirmation -> error", error)
            })
        }
      }
    }
  })

  return (
    <SpinnerContainer>
      <Spin tip="Authenticating..." size="large" />
    </SpinnerContainer>
  )
}

export default Confirmation
