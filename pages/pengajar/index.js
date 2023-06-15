import AddDelete from "@/components/AddDelete";
import useDeleteSiswaContext from "@/context/siswa/useDeleteSiswa";
import useDeletePengajarContext from "@/context/useDeletePengajarContext";
import { SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, Popconfirm, Space, Spin, Table, message } from "antd";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

Pengajar.layout = "L1";

export default function Pengajar({ pengajar }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const { handleDelete, loading } = useDeletePengajarContext();
    const searchInput = useRef(null);
    const data = [];
    const { push } = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    pengajar?.data.map((item) =>
        data.push({
            key: item._id,
            nama: item?.nama,
            nik: item?.nik,
            mengajar: item?.mengajar,
            ekstrakurikuler: item?.ekstrakurikuler?.map((item) => item?.nama).join(", "),
            alamat: item?.alamat,
            tgl: item?.tgl,
            noTelp: item?.noTelp,
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

    const confirm = (record) => {
        const data = [];
        data.push(record?.nik);
        handleDelete(data, config) // Call handleDelete from useDeleteSiswaContext
            .then(() => {
                message.success("Data siswa berhasil dihapus");
            })
            .catch((err) => {
                console.log(err);
                message.error("Terjadi kesalahan saat menghapus data siswa");
            });
    };

    const cancel = (e) => {
        console.log(e);
        message.error("Click on No");
    };

    const columns = [
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "300px",
            ...getColumnSearchProps("nama"),
            fixed: "left",
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
        },
        {
            title: "No Telp",
            dataIndex: "noTelp",
            key: "noTelp",
            ...getColumnSearchProps("noTelp"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Edit",
            dataIndex: "edit",
            fixed: "right",
            width: "200px",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Yakin ingin menghapus?"
                        onConfirm={() => confirm(record)}
                        onCancel={cancel}>
                        <Button
                            type="primary"
                            danger>
                            Delete
                        </Button>
                    </Popconfirm>
                    <Button
                        type="primary"
                        onClick={() => push(`/pengajar/${record?.nik}`)}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
            setSelectedRow(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const [selectedRow, setSelectedRow] = useState([]);

    return (
        <Spin spinning={loading}>
            <div>
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
                    <AddDelete
                        link={"/pengajar/tambah"}
                        text="Tambah"
                    />
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
        </Spin>
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
