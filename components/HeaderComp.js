import { selecUser } from "@/redux/slices/userSlices";
import { DownOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout } from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const { Header } = Layout;

export default function HeaderComp({ showDrawer }) {
    const user = useSelector(selecUser)
    const router = useRouter()

    const items = [
        {
            key: "",
            danger: true,
            label: <div onClick={() => router.push('/auth/login')}>Logout</div>,
        },
    ];

    return (
        <Header className="site-header bg-red-500">
            <Button onClick={showDrawer} type="text" icon={<MenuOutlined className="text-white" />}></Button>
            <Dropdown
                menu={{
                    items,
                }}
                placement="bottomLeft"
                arrow>
                <Button
                    type="ghost"
                    icon={
                        <UserOutlined
                            style={{
                                color: "white",
                            }}
                        />
                    }>
                    <span className="text-white">{user?.name}</span>
                    <DownOutlined
                        style={{
                            color: "white",
                        }}
                    />
                </Button>
            </Dropdown>
        </Header>
    );
}
