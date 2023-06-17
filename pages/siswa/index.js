import siswaService from "@/services/siswa.service";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, Popconfirm, Space, Table, Typography, message } from "antd";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

Pengajar.layout = "L1";

export default function Pengajar({ siswa, kelas }) {
    const { push, asPath } = useRouter();

    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);

    const searchInput = useRef(null);
    const data = [];
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    siswa?.data.map((item) =>
        data.push({
            key: item._id,
            nama: item?.name,
            nis: item?.nis,
            alamat: item?.alamat,
            tgl: dayjs(item?.tgl).format("DD/MM/YY"),
            nilai: item?.nilai,
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

    const confirm = async (record) => {
        try {
            setLoading(true);
            const deleteRes = await siswaService.delete(selectedRow?.map((item) => item?.nis));
            message.success(deleteRes?.message);
            push(asPath);
        } catch (err) {
            console.log(err);
            message.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "300px",
            ...getColumnSearchProps("nama"),
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `siswa/${record?.nis}`,
                    }}>
                    {record?.nama}
                </Link>
            ),
        },
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis",
            width: "200px",
            ...getColumnSearchProps("nis"),
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
            width: "200px",
        },
        {
            title: "Nilai",
            dataIndex: "nilai",
            key: "nilai",
            ...getColumnSearchProps("nilai"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `nilai/${record?.key}`,
                    }}>
                    Detail
                </Link>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    return (
        <>
            <Head>
                <title>Siswa | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Data Siswa</Typography.Title>
                <div className="my-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: "Siswa",
                            },
                        ]}
                    />
                    <Space>
                        <Link
                            href={{
                                pathname: "/pengajar/tambah",
                            }}>
                            <Button
                                type="default"
                                icon={<DeleteOutlined />}>
                                Tambah
                            </Button>
                        </Link>
                        {selectedRow?.length > 0 && (
                            <Popconfirm
                                title="Delete Data"
                                description="Are you sure to delete this data?"
                                onConfirm={confirm}
                                okText="Yes"
                                cancelText="No">
                                <Button danger>Delete</Button>
                            </Popconfirm>
                        )}
                    </Space>
                </div>
                <Table
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
            </div>
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
        props: {},
    };
}
