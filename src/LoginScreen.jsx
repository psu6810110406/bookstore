import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import axios from 'axios'

const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  const handleLogin = async (formData) => {
    try{
      setIsLoading(true)
      setErrMsg(null)
      const response = await axios.post(URL_AUTH, formData);
      const token = response.data.access_token;
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      props.onLoginSuccess();
    } catch(err) { 
      console.log(err)
      setErrMsg(err.message)
    } finally { setIsLoading(false) }
  }

  return(

    <div className="login-box"> 
      
      <h2>เข้าสู่ระบบ</h2> {/*  */}

      <Form
        onFinish={handleLogin}
        autoComplete="off"
      >
        {errMsg &&
          <Form.Item>
            <Alert message={errMsg} type="error" />
          </Form.Item>
        }

        <Form.Item
          label="Username"
          name="username"
          rules={[{required: true,}]}>
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Password"
          name="password"
          rules={[{required: true},]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          {/* ปุ่มจะถูกจัดสไตล์โดย .login-box .ant-btn-primary ใน CSS */}
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}>
            เข้าสู่ระบบ
          </Button>
        </Form.Item>
      </Form>
    </div> 
  )
}