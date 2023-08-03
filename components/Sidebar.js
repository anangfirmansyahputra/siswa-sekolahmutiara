import { items } from "@/constants";
import { Drawer, Menu } from "antd";
import { useRouter } from "next/router";

export default function Sidebar({ onClose, open }) {
    const { pathname, push } = useRouter();

    const selectedKey = (pathname === "/secure/dashboard" && "dashboard") || (pathname.includes("/secure/pengajar") && "pengajar") || (pathname.includes("/secure/ekstrakurikuler") && "ekstrakurikuler") || (pathname.includes("/secure/siswa") && "siswa") || (pathname.includes("/secure/absensi") && "absensi") || (pathname.includes("/secure/arsib") && "arsib") || (pathname.includes("/secure/pengumuman") && "pengumuman") || (pathname.includes("/secure/ekstraku") && "ekstraku");

    return (
        <Drawer title="Menu" placement="left" onClose={onClose} open={open} width={250}>
            <Menu
                //   onClick={onClick}
                // theme="dark"
                style={{
                    // width: "200px",
                    border: 'none'
                }}
                // inlineIndent={10}
                defaultSelectedKeys={selectedKey}
                //   defaultOpenKeys={['sub1']}
                mode="vertical"
                items={items}
                selectedKeys={[selectedKey]}
                onSelect={(e) => {
                    push(e.key === "dashboard" ? "/secure/dashboard" : "/secure/" + e.key)
                    onClose()
                }}
            />
        </Drawer>
    );
}
