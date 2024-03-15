import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    BookOutlined,
    NotificationOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import TestCreation from "../components/TestCreation"
import TestSelectionStudent from '../pages/TestSelectionStudent';
import TestSelectionTeacher from '../pages/TestSelectionTeacher';
import GradeReport from "../pages/GradeReport"
import Register from "../pages/Register"
import ClassroomPage from '../pages/ClassroomPage';
import TestCorrectionSingle from './TestCorrectionSingle';
import { useNavigate, useLocation } from 'react-router-dom';


const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Provas', 'Provas', <BookOutlined />, [
        getItem('Listar Provas', 'Listar Provas'),
        getItem('Provas', 'Provas'),
        getItem('Criar Prova', 'Criar Prova'),
        getItem('Resultados', 'Resultados'),
        getItem('Provas a Corrigir', 'Provas a Corrigir')
    ]),
    getItem('Salas', 'Salas', <HomeOutlined />, [
        getItem('Criar Sala', 'Criar Sala'),
        getItem('Remover Sala', 'Remover Sala')
    ]),
    getItem('Utilizadores', 'Utilizadores', <UserOutlined />, [
        getItem('Adicionar Utilizador', 'Adicionar Utilizador'),
        getItem('Remover Utilizador', 'Remover Utilizador')
    ]),
    getItem('Notificações', 'Notificações', <NotificationOutlined />)
];


function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('0');

    const navigate = useNavigate();
    const location = useLocation();
    const token = location.state?.token;
    const userrole = location.state?.userrole;
    const email = location.state?.email;

    console.log(location.state?.userrole)

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    const onClick = (e) => {
        console.log(e)
        setCurrent(e.key);
    };

    const filteredItems = items.filter(item => {
        if (userrole === 0) { // For student
            return item.label !== 'Utilizadores' && item.label !== 'Salas';
        } else if (userrole === 1) { // For teacher
            // Adjust conditions based on roles
            return item.label !== 'Utilizadores' && item.label !== 'Salas';
        } else if (userrole === 2) { // For tecnico
            return item.label !== 'Provas'; // Tecnico can see all items
        } else {
            return false; // If no valid userrole, show nothing
        }
    });

    const renderContent = () => {
        if (userrole === 0) { // Student specific content
            // Adjust cases based on roles
            switch (current) {
                case 'Listar Provas':
                    return <TestSelectionStudent token={token} userrole={userrole} email={email} />;
                case 'Resultados':
                    return <GradeReport token={token} userrole={userrole} email={email} />;
                default:
                    return <></>;
            }
        } else if (userrole === 1) { // Teacher specific content
            // Adjust cases based on roles
            switch (current) {
                case 'Criar Prova':
                    return <TestCreation token={token} userrole={userrole} email={email} />;
                case 'Listar Provas':
                    return <TestSelectionTeacher token={token} userrole={userrole} email={email} />;
                case 'Provas a Corrigir':
                    return <TestCorrectionSingle token={token} userrole={userrole} email={email} />;    
                // ... other teacher specific cases
                default:
                    return <></>;
            }
        } else if (userrole === 2) { // Tecnico specific content
            // Adjust cases based on roles
            switch (current) {
                case 'Adicionar Utilizador':
                    return <Register token={token} userrole={userrole} email={email} />;
                case 'Criar Sala':
                    return <ClassroomPage token={token} userrole={userrole} email={email} />;
                case 'Remover Sala':
                    return <ClassroomPage token={token} userrole={userrole} email={email} />;
                    
                // ... other tecnico specific cases
                default:
                    return <></>;
            }
        }
        // Default case if no role matches
        return <></>;
    }

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={filteredItems} onClick={onClick} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{current == '0' ? "" : current}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Home;