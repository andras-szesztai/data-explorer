import React from "react"
import styled from "styled-components"
import { Form, Input, Button } from "antd"
import { useHistory } from "react-router-dom";

import { auth } from "../../firebase"

import { loginUser } from "../../actions/userActions"

import { UserDispatchContext, UserStateContext } from "../../App"

const MainContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 32 },
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Login = (props: any) => {
  const userState = React.useContext(UserStateContext)
  const updateUserState = React.useContext(UserDispatchContext)

  let history = useHistory();

  const getUser = async ({
    password,
    email,
  }: {
    password: string
    email: string
  }) => {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password)
      if (user) {
        updateUserState(loginUser())
        history.push("/home")
      }
      console.log(user?.email)
      console.log(user?.uid)
      // generateUserDocument(user, { displayName })
    } catch (error) {
      console.log("App -> error", error)
      // setError("Error Signing up with email and password")
    }
  }
  // React.useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const { user } = await auth.signInWithEmailAndPassword(
  //         "andras@test.com",
  //         "123456"
  //       )
  //       console.log(user?.email)
  //       console.log(user?.uid)
  //       // generateUserDocument(user, { displayName })
  //     } catch (error) {
  //       console.log("App -> error", error)
  //       // setError("Error Signing up with email and password")
  //     }
  //   }
  //   getUser()
  // }, [])

  return (
    <MainContainer>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(values) => getUser(values)}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          // rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </MainContainer>
  )
}

export default Login
