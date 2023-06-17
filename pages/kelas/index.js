import kelasService from "@/services/kelas.service";
import pengajarService from "@/services/pengajar.service";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, Popconfirm, Space, Table, Typography, message } from "antd";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

Kelas.layout = "L1";

export default function Kelas({ kelas }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);

    const searchInput = useRef(null);
    const data = [];
    const { push, asPath } = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    kelas?.data.map((item) =>
        data.push({
            key: item._id,
            name: item?.name,
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

    const confirm = async (record) => {
        try {
            setLoadingFirst(true);
            const res = await kelasService.delete({ ids: selectedRow });
            message.success(res?.message);
            push(asPath);
        } catch (err) {
            message.error(err?.message);
        } finally {
            setLoadingFirst(false);
        }
    };

    const columns = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            // width: "300px",
            ...getColumnSearchProps("name"),
            // fixed: "left",
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/kelas/${record?.key}`,
                    }}>
                    {record?.name}
                </Link>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
        }),
    };

    return (
        <>
            <Head>
                <title>Kelas | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Typography.Title level={2}>Data Kelas</Typography.Title>
                <div className="my-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: "Kelas",
                            },
                        ]}
                    />
                    <Space>
                        <Link
                            href={{
                                pathname: "/kelas/tambah",
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
                />
            </>
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
