import React from 'react';
import { Navigate, Link } from "react-router-dom"
import { useState } from "react"
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { ToastContainer, toast } from "react-toastify"
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Register () {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            console.log('Received values of form: ', values);
            const response = await axios.post('http://localhost:3003/register', {
                email: values.email,
                password: values.password,
                role: parseInt(values.role)
            });
            
            navigate('/login')

            
            //localStorage.setItem("token", response.data.token)
            //setIsLoggedIn(true)
            // Handle successful login (e.g., redirect, store token)
        } catch (error) {
            toast.info("Os dados introduzidos são inválidos!", {
                position: toast.POSITION.TOP_CENTER
            })
        }
    };
    
    return (
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
                name="normal_register"
                className="register-form"
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
                <Form.Item
                    name="role"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your role!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="role"
                        placeholder="role"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="register-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button">
                        Registar
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </>
    )
};

export default Register;
