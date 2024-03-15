import React from 'react';
import { Navigate, Link } from "react-router-dom"
import { useState } from "react"
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { ToastContainer, toast } from "react-toastify"
import axios from 'axios';


function Login () {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userrole, setRole] = useState(-1) // 0 - student, 1 - teacher, 2 - tecnico
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);

    const onFinish = async (values) => {
        try {
            console.log('Received values of form: ', values);
            const response = await axios.post('http://localhost:3003/login', {
                email: values.email,
                password: values.password
            });
            console.log(response.data);
            setEmail(values.email);
            
                           
            const userInfoResponse = await axios.get(`http://localhost:3003/users/${values.email}/?secret_token=${response.data.token}`);
            const userInfo = userInfoResponse.data;
            console.log('User info:', userInfo);
  
            localStorage.setItem('id', userInfo.email)
            localStorage.setItem("token", response.data.token)
            setToken(response.data.token)
            

            setRole(userInfo.role)
            setIsLoggedIn(true)

            // Handle successful login (e.g., redirect, store token)
        } catch (error) {
            toast.info("Os dados introduzidos são inválidos!", {
                position: toast.POSITION.TOP_CENTER
            })
        }
    };
    if (isLoggedIn) {
        console.log(userrole)
        return (
            <Navigate to="/" replace state={{ token: token, userrole: userrole , email: email}} />
        );
    }
    
    const loginForm = (
        <>
        <ToastContainer />
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <Form
                logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </>
    )


    return (
        <>  
            {loginForm}
        </>
    )
};

export default Login;
