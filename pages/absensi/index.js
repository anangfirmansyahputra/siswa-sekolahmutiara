import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, Button, Card, Input, Layout, Popconfirm, Space, Table, Typography, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";

Absensi.layout = "L1";
const { Content } = Layout

export default function Absensi({ ekstrakurikuler }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const data = [];
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    ekstrakurikuler?.data.map(
        (item) =>
            item?.approve &&
            data.push({
                key: item._id,
                name: item?.name,
                kehadiran: item?.kehadiran,
                pertemuan: item?.pertemuan,
                lokasi: item?.lokasi,
                waktu: item?.waktu?.map((item) => dayjs(item).format("HH:mm")).join(" - "),
                hari: item?.hari?.charAt(0).toUpperCase() + item?.hari?.slice(1),
                wajib: item?.wajib === true ? "Wajib" : "Pilihan",
            })
    );

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}>
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}>
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const columns = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            width: "fit",
            ...getColumnSearchProps("name"),
            // fixed: "left",
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/absensi/${record?.key}`,
                    }}>
                    {record?.name}
                </Link>
            ),
        },
        {
            title: "Jumlah Pertemuan",
            dataIndex: "kehadiran",
            key: "kehadiran",
            // width: "10px",
            ...getColumnSearchProps("kehadiran"),
            // render: (_, record) => {
            //     return (
            //         <Button
            //             type="link"
            //             onClick={() => router.push(`/absensi/${record?.key}`)}>
            //             {record?.pertemuan}/{record?.kehadiran}
            //         </Button>
            //     );
            // },
        },
        {
            title: "Lokasi",
            dataIndex: "lokasi",
            key: "lokasi",
            ...getColumnSearchProps("lokasi"),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Waktu",
            dataIndex: "waktu",
            key: "waktu",
            ...getColumnSearchProps("waktu"),
        },
        {
            title: "Hari",
            dataIndex: "hari",
            key: "hari",
            ...getColumnSearchProps("hari"),
        },
        {
            title: "Status",
            dataIndex: "wajib",
            key: "wajib",
            ...getColumnSearchProps("wajib"),
            sortDirections: ["descend", "ascend"],
            render: (_, record) => <div className={`w-fit ${record?.wajib === "Wajib" ? "bg-green-300" : "bg-yellow-300"} rounded px-5 py-1 `}>{record?.wajib}</div>,
        },
    ];


    return (
        <>
            <Head>
                <title>Absensi | Sistem Informasi Mutiara</title>
            </Head>
            <Content style={{ margin: "0 16px" }}>
                <div className="flex justify-between items-center">
                    <div>
                        <Typography.Title
                            level={3}
                            style={{ marginBottom: "0" }}>
                            Absensi
                        </Typography.Title>
                        <Breadcrumb style={{ margin: "0 0 16px" }} items={[
                            {
                                title: <Link href={{
                                    pathname: "/dashboard"
                                }}>Dashboard</Link>
                            },
                            {
                                title: "Absensi"
                            }
                        ]} />
                    </div>
                </div>
                <Card>
                    <Table
                        bordered
                        size="large"
                        // rowSelection={{
                        //     type: "checkbox",
                        //     ...rowSelection,
                        // }}
                        style={{
                            height: "100",
                            marginTop: 10,
                        }}
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: "fit",
                        }}
                    />
                </Card>

            </Content>

        </>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
            props: {},
        };
    }

    return {
        props: {
            // ekstrakurikuler: data,
        },
    };
}
