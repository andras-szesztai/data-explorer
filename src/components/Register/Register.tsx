import React from "react"
import styled from "styled-components"
import { Form, Input, Button, Space, Tooltip } from "antd"
import { useHistory, Link } from "react-router-dom"
import { Formik } from "formik"

import { auth } from "../../firebase"

import { loginUser } from "../../actions/userActions"

import { UserDispatchContext, UserStateContext } from "../../App"
import { LockOutlined, UserOutlined } from "@ant-design/icons"

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

interface RegisterValues {
  email: string
  password: string
}

const Login = (props: any) => {
  const userState = React.useContext(UserStateContext)
  const updateUserState = React.useContext(UserDispatchContext)

  const history = useHistory()

  const initialValues: RegisterValues = { email: "", password: "" }

  // const getUser = async ({
  //   password,
  //   email,
  // }: {
  //   password: string
  //   email: string
  // }) => {
  //   try {
  //     const { user } = await auth.signInWithEmailAndPassword(email, password)
  //     if (user) {
  //       updateUserState(loginUser())
  //       history.push("/")
  //     }
  //     console.log(user?.email)
  //     console.log(user?.uid)
  //     // generateUserDocument(user, { displayName })
  //   } catch (error) {
  //     // setError("Error Signing up with email and password")
  //   }
  // }
  // // React.useEffect(() => {
  // //   const getUser = async () => {
  // //     try {
  // //       const { user } = await auth.signInWithEmailAndPassword(
  // //         "andras@test.com",
  // //         "123456"
  // //       )
  // //       console.log(user?.email)
  // //       console.log(user?.uid)
  // //       // generateUserDocument(user, { displayName })
  // //     } catch (error) {
  // //       console.log("App -> error", error)
  // //       // setError("Error Signing up with email and password")
  // //     }
  // //   }
  // //   getUser()
  // // }, [])

  return (
    <MainContainer>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          let errors = {} as RegisterValues
          if (!values.email) {
            errors.email = "Required"
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Please enter a Jus"
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          console.log("touched", touched)
          console.log("errors", errors)
          console.log("values", values)
          return (
            <Form {...layout} onFinish={handleSubmit}>
              <Form.Item label="Email" name="email" >
                <Input onChange={handleChange} onBlur={handleBlur} />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input.Password onChange={handleChange} onBlur={handleBlur} />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                  <Button
                    type="text"
                    onClick={() => {
                      history.push("/login")
                    }}
                  >
                    Login
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )
        }}
      </Formik>
    </MainContainer>
  )
}

export default Login
