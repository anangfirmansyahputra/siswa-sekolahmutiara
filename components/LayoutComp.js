// import { items } from "@/constants/index";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Typography } from "antd";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import HeaderComp from "./HeaderComp";

const { Content, Footer, Header, Sider } = Layout;
const { Title } = Typography;

export default function LayoutComp({ children, session }) {
    return (
        <SessionProvider session={session}>
            <Layout className="h-screen">
                <Sidebar />
                <Layout>
                    <HeaderComp />
                    <Content
                        style={{
                            padding: "24px 50px 0",
                            overflow: "auto",
                            height: "100vh - 64px",
                        }}>
                        {children}
                    </Content>
                    <Footer
                        style={{
                            textAlign: "center",
                        }}>
                        Sekolah Mutiara ©2023 Created by Divana Faradila
                    </Footer>
                </Layout>
            </Layout>
        </SessionProvider>
    );
}
