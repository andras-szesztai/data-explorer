import React from "react"
import styled from "styled-components"
import { Form, Input, Button, Space, message } from "antd"
import { MailOutlined } from "@ant-design/icons"

import { auth } from "../../firebase"

const MainContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Login = () => {
  const sendEmail = async (email: string) => {
    if (/justiceandpeace.nl$/.test(email)) {
      try {
        auth.sendSignInLinkToEmail(email, {
          url: window.location.href.replace("login", "confirmation"),
          handleCodeInApp: true,
        })
        window.localStorage.setItem("emailForSignIn", email)
        message.success(
          "Email sent, please check out your inbox! You can close this tab now."
        )
      } catch (error) {
        message.error(error.message)
      }
    } else {
      message.error("Invalid email address")
    }
  }

  return (
    <MainContainer>
      <Form
        style={{
          width: 400,
        }}
        name="basic"
        onFinish={({ email }) => sendEmail(email)}
      >
        <Form.Item name="email">
          <Input placeholder="Please enter an email" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              style={{
                width: 400,
              }}
              type="primary"
              htmlType="submit"
              block
              icon={<MailOutlined />}
            >
              Send confirmation email
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </MainContainer>
  )
}

export default Login
