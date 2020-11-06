import React from "react"
import styled from "styled-components"
import { Form, Input, Button, Checkbox } from "antd"

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

const Login = () => {
  return (
    <MainContainer>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
        >
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
