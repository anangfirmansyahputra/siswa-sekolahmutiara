import { CalendarOutlined, CameraOutlined, CarryOutOutlined, CrownOutlined, FileSearchOutlined, PieChartOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const items = [
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
    // {
    //     label: "Siswa",
    //     key: "siswa",
    //     icon: <UsergroupAddOutlined />,
    // },
    {
        label: "Nilai",
        key: "nilai",
        icon: <CarryOutOutlined />,
    },
    {
        label: "Prestasi",
        key: "prestasi",
        icon: <CrownOutlined />,
    },
    {
        label: "Gallery",
        key: "gallery",
        icon: <CameraOutlined />,
    },
    // {
    //     label: "Pelajaran",
    //     key: "matpel",
    //     icon: <FileSearchOutlined />,
    // },
];

export default items;
