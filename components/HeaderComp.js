import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout } from "antd";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const { Header } = Layout;

export default function HeaderComp() {
    const { data } = useSession();
    const role = data?.user?.user?.role;

    const items = [
        {
            key: "1",
            danger: false,
            label: (
                <Link
                    href={{
                        pathname: "/profile",
                    }}>
                    Profile
                </Link>
            ),
        },
        {
            key: "2",
            danger: true,
            label: <div onClick={() => signOut({ callbackUrl: (role === "siswa" && "/login-siswa") || (role === "admin" && "/login") || (role === "pengajar" && "/login-pengajar") })}>Logout</div>,
        },
    ];

    // console.log(data?.user?.user?.username);

    return (
        <Header
            style={{
                background: "white",
            }}>
            <div className="flex items-center justify-between">
                <div>Sekolah Mutiara</div>
                <Dropdown
                    menu={{
                        items,
                    }}
                    placement="bottomLeft"
                    arrow>
                    <Button
                        type="default"
                        icon={<UserOutlined />}>
                        {data?.user?.user?.username}
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
        </Header>
    );
}
