import { CalendarOutlined, CameraOutlined, CarryOutOutlined, CrownOutlined, FileSearchOutlined, PieChartOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const items = [
    {
        label: "Dashboard",
        key: "secure/dashboard",
        icon: <PieChartOutlined />,
    },
    {
        label: "Ekstrakurikuler",
        key: "secure/ekstrakurikuler",
        icon: <CalendarOutlined />,
    },
    // {
    //     label: "Siswa",
    //     key: "secure/siswa",
    //     icon: <UsergroupAddOutlined />,
    // },
    {
        label: "Nilai",
        key: "secure/nilai",
        icon: <CarryOutOutlined />,
    },
    {
        label: "Prestasi",
        key: "secure/prestasi",
        icon: <CrownOutlined />,
    },
    {
        label: "Gallery",
        key: "secure/gallery",
        icon: <CameraOutlined />,
    },
    // {
    //     label: "Pelajaran",
    //     key: "secure/matpel",
    //     icon: <FileSearchOutlined />,
    // },
];

export default items;
