import React from 'react';
import { Button, Layout, Menu, Breadcrumb, Typography, Card } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined } from '@ant-design/icons';
//import '../components/TeacherDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

const TeacherDashboard = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { token: token } });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => handleNavigation('/')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />} onClick={() => handleNavigation('/test-creation')}>
            Criar Prova
          </Menu.Item>
          <SubMenu key="sub1" icon={<FileOutlined />} title="Provas">
            <Menu.Item key="3" onClick={() => handleNavigation('/test-selector')}>Provas Criadas</Menu.Item>
            <Menu.Item key="4" onClick={() => handleNavigation('/provas-realizadas')}>Provas Realizadas</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }} >
          <Title level={1} style={{ margin: '14px 16px' }}>Teacher Dashboard</Title>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Card title="Welcome, Professor!" bordered={false} style={{ width: 300 }}>
              <p>Quick actions:</p>
              <Button type="primary" onClick={() => handleNavigation('/test-creation')}>Criar Prova</Button>
              <Button style={{ marginTop: '10px' }} onClick={() => handleNavigation('/test-selector')}>Provas Criadas</Button>
              <Button style={{ marginTop: '10px' }} onClick={() => handleNavigation('/provas-realizadas')}>Provas Realizadas</Button>
            </Card>
          </div>
        </Content>
       </Layout>
    </Layout>
  );
};

export default TeacherDashboard;
