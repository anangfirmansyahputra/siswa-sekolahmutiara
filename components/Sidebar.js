import { items } from "@/constants";
import { CalendarOutlined, CarryOutOutlined, FolderOutlined, PieChartOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const { Sider } = Layout;

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const { data } = useSession();
    const role = data?.user?.user?.role;

    const notAdmin = [
        {
            label: "Dashboard",
            key: "dashboard",
            icon: <PieChartOutlined />,
        },
        {
            label: "Ekstrakurikuler",
            key: "ekstrakurikuler",
            icon: <CalendarOutlined />,
        },
        {
            label: "Absensi",
            key: "absensi",
            icon: <CarryOutOutlined />,
        },
        {
            label: "Arsip",
            key: "arsip",
            icon: <FolderOutlined />,
        },

        {
            label: "Ekstraku",
            key: "ekstraku",
            icon: <SnippetsOutlined />,
        },
    ];

    const selectedKey = (router.pathname === "/" && "dashboard") || (router.pathname.includes("/pengajar") && "pengajar") || (router.pathname.includes("/ekstrakurikuler") && "ekstrakurikuler") || (router.pathname.includes("/siswa") && "siswa") || (router.pathname.includes("/absensi") && "absensi") || (router.pathname.includes("/arsib") && "arsib") || (router.pathname.includes("/pengumuman") && "pengumuman") || (router.pathname.includes("/ekstraku") && "ekstraku");

    return (
        <Sider
            breakpoint="lg"
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            onBreakpoint={(broken) => {}}>
            <Menu
                theme="dark"
                items={role === "admin" ? items : notAdmin}
                selectedKeys={[selectedKey]}
                onSelect={(e) => router.push(e.key === "dashboard" ? "/" : "/" + e.key)}
            />
        </Sider>
    );
}
