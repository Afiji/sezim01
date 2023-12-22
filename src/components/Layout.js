import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

import { Layout } from "antd";
import Snowflakes from "./Snowflakes/Snowflakes";

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ display: "flex", minHeight: "100vh" }}>
      {/* <Snowflakes /> */}
      <Sidebar />
      <Layout style={{ width: "100%" }}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#324A66",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
