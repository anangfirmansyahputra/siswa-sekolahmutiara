import useDeletePengajarContext from "@/context/useDeletePengajarContext";
import http from '@/plugin/https';
import pengajarService from "@/services/pengajar.service";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Input, Layout, Popconfirm, Space, Table, Typography, message } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

Pengajar.layout = "L1";
const { Content } = Layout

export default function Pengajar({ pengajar }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const { handleDelete, loading } = useDeletePengajarContext();
    const searchInput = useRef(null);
    const data = [];
    const { push, asPath } = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    pengajar?.data.map((item) =>
        data.push({
            key: item._id,
            nama: item?.nama,
            nik: item?.nik,
            mengajar: item?.mengajar,
            ekstrakurikuler: item?.ekstrakurikuler,
            alamat: item?.alamat,
            tgl: item?.tgl,
            noTelp: item?.noTelp,
        })
    );

    useEffect(() => {
        setLoadingFirst(false);
    }, []);

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

    const confirm = async (record) => {
        try {
            setLoadingFirst(true);
            const deleteRes = await pengajarService.delete(selectedRow?.map((item) => item?.nik));
            message.success(deleteRes?.message);
            push(asPath);
        } catch (err) {
            message.error(err);
        } finally {
            setLoadingFirst(false);
        }
    };

    const columns = [
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "300px",
            ...getColumnSearchProps("nama"),
            // fixed: "left",
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/pengajar/${record?.nik}`,
                    }}>
                    {record?.nama}
                </Link>
            ),
        },
        {
            title: "NIK",
            dataIndex: "nik",
            key: "nik",
            width: "200px",
            ...getColumnSearchProps("nik"),
        },
        {
            title: "Mengajar",
            dataIndex: "mengajar",
            key: "mengajar",
            ...getColumnSearchProps("mengajar"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Ekstrakurikuler",
            dataIndex: "ekstrakurikuler",
            key: "ekstrakurikuler",
            ...getColumnSearchProps("ekstrakurikuler"),
            width: "200px",
            render: (_, record) => <span>{record?.ekstrakurikuler?.length > 0 ? record?.ekstrakurikuler?.map((item) => item?.name).join(", ") : "-"}</span>,
        },
        {
            title: "Alamat",
            dataIndex: "alamat",
            key: "alamat",
            ...getColumnSearchProps("alamat"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Tanggal Lahir",
            dataIndex: "tgl",
            key: "tgl",
            ...getColumnSearchProps("tgl"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
            render: (_, record) => <span>{dayjs(record?.tgl).format("DD/MM/YYYY")}</span>,
        },
        {
            title: "No Telp",
            dataIndex: "noTelp",
            key: "noTelp",
            ...getColumnSearchProps("noTelp"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
        }),
    };

    const [selectedRow, setSelectedRow] = useState([]);

    return (
        <>
            <Head>
                <title>Pengajar | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Content style={{ margin: "0 16px" }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <Typography.Title
                                level={3}
                                style={{ marginBottom: "0" }}>
                                Pengajar
                            </Typography.Title>
                            <Breadcrumb style={{ margin: "0 0 16px" }} items={[
                                {
                                    title: <Link href={{
                                        pathname: "/dashboard"
                                    }}>Dashboard</Link>
                                },
                                {
                                    title: "Pengajar"
                                }
                            ]} />
                        </div>
                        <Space>
                            <Link
                                href={{
                                    pathname: "/pengajar/tambah",
                                }}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}>
                                    Pengajar
                                </Button>
                            </Link>
                            {selectedRow?.length > 0 && (
                                <Popconfirm
                                    title="Delete Data"
                                    description="Are you sure to delete this data?"
                                    onConfirm={confirm}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button danger type="primary" icon={<DeleteOutlined />}>Hapus</Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </div>
                    <Card>
                        <Table
                            loading={loadingFirst}
                            sticky
                            bordered
                            size="large"
                            rowSelection={{
                                type: "checkbox",
                                ...rowSelection,
                            }}
                            style={{
                                height: "100",
                            }}
                            columns={columns}
                            dataSource={data}
                            scroll={{
                                x: 1200,
                            }}
                        />
                    </Card>
                </Content>

            </>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/admin/pengajar')
    // if (!session) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/login",
    //         },
    //         props: {},
    //     };
    // }

    return {
        props: {
            pengajar: data,
        },
    };
}
