import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
const { Header, Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    // Функция для определения ключа по текущему маршруту
    const getKeyByPath = (path) => {
      switch (path) {
        case "/profile":
          return "1";
        case "/todos":
          return "2";
        case "/exportToExcel":
          return "3";
        default:
          return "";
      }
    };
    // Установка активного ключа в зависимости от маршрута
    setSelectedKeys([getKeyByPath(location.pathname)]);
  }, [location]);

  return (
    // <Layout style={{ minHeight: "100vh" }}>
    <>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          // defaultSelectedKeys={["1"]}
          selectedKeys={selectedKeys}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            style={{ marginTop: "30px" }}
          >
            <NavLink to="/profile">Профиль</NavLink>
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            <NavLink to="/todos">To do</NavLink>
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            <NavLink to="/exportToExcel">Выгрузка в Ecxel</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
      </Layout>
      {/* </Layout> */}
    </>
  );
};

export default Sidebar;
