// import { items } from "@/constants/index";
import authService from "@/services/auth.service";
import { Layout, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderComp from "./HeaderComp";
import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlices";

const { Content, Footer, Header, Sider } = Layout;
const { Title } = Typography;

export default function LayoutComp({ children, session, isLoading }) {
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false)
    const router = useRouter()
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('siswa-token')

        const fetchData = async () => {
            if (token) {
                setIsLogin(true)
                const me = await authService.me({ token })
                dispatch(setUser(me.data))

                if (router.pathname === "/_error") {
                    router.push('/secure/dashboard')
                }

            } else {
                setIsLogin(false)
                router.push('/auth/login')
            }
        }

        fetchData()
    }, [])

    return (
        <Layout className="h-screen">
            <Sidebar open={open} onClose={onClose} />
            <Layout>
                <HeaderComp showDrawer={showDrawer} />
                <Content
                    className="home-container"
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
                    Sekolah Mutiara ©2023 Created by <span className="font-bold">Divana Faradila</span>
                </Footer>
            </Layout>
        </Layout>

    );
}
