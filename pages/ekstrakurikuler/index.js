import useDeleteEkstra from "@/context/ektrakurikuler/useDeleteEkstra";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, Button, Input, Popconfirm, Space, Table, message } from "antd";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";

Ekstrakurikuler.layout = "L1";

export default function Ekstrakurikuler({ ekstrakurikuler }) {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const { handleDelete } = useDeleteEkstra();
    const searchInput = useRef(null);
    const [pending, setPending] = useState(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
    const [showPending, setShowPending] = useState(false);
    const data = [];
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const role = session?.user?.user?.role;

    ekstrakurikuler?.data.map(
        (item) =>
            item?.approve &&
            data.push({
                key: item._id,
                nama: item?.nama,
                pendaftar: item?.pendaftar?.length,
                lokasi: item?.lokasi,
                waktu: item?.waktu,
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

    const confirm = (record) => {
        // handleDelete()
        const data = [];
        // data.push(record?.key);
        // console.log(record?.key);
        handleDelete(record?.key, config)
            .then(message.success("Click on Yes"))
            .catch((err) => console.log(err));
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
            width: "fit",
            ...getColumnSearchProps("nama"),
            // fixed: "left",
        },
        {
            title: "Pendaftar",
            dataIndex: "pendaftar",
            key: "pendaftar",
            // width: "10px",
            ...getColumnSearchProps("pendaftar"),
            render: (_, record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => router.push(`/ekstrakurikuler/${record?.key}/pendaftar`)}>
                        {record?.pendaftar}
                    </Button>
                );
            },
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
            title: "Status",
            dataIndex: "wajib",
            key: "wajib",
            ...getColumnSearchProps("wajib"),
            sortDirections: ["descend", "ascend"],
            render: (_, record) => <div className={`w-fit ${record?.wajib === "Wajib" ? "bg-green-300" : "bg-yellow-300"} rounded px-5 py-1 `}>{record?.wajib}</div>,
        },
        {
            title: "Detail",
            dataIndex: "detail",
            fixed: "right",
            render: (_, record) => (
                // <Space>
                //     <Popconfirm
                //         title="Yakin ingin menghapus?"
                //         onConfirm={() => confirm(record)}
                //         onCancel={cancel}>
                //         <Button
                //             type="primary"
                //             danger>
                //             Delete
                //         </Button>
                //     </Popconfirm>
                //     <Button
                //         type="primary"
                //         onClick={() => router.push(`/ekstrakurikuler/${record?.key}`)}>
                //         Edit
                //     </Button>
                // </Space>
                <Button
                    type="link"
                    onClick={() => router.push(`/ekstrakurikuler/${record?.key}`)}>
                    Detail
                </Button>
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

    const handleApprove = async (id) => {
        Swal.fire({
            title: "Yakin ingin meng aprovenya?",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "Iya",
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.put(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/admin/ekstrakurikuler/approve/${id}`);
                    Swal.fire("Berhasil", data?.message, "success").then(() => {
                        setShowPending(false);
                        setPending(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
                        router.push(router.asPath);
                    });
                } catch (err) {
                    Swal.fire("Gagal", err?.data?.message, "error");
                }
            }
        });
    };

    const handleReject = async (id) => {
        const { data } = await axios.delete(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/pengajar/ekstrakurikuler/${id}`);
        message.success("Reject ekstrakurikuler berhasil");
    };

    if (role === "siswa") {
        columns.splice(4, 1);
        columns.pop();
        columns.push({
            title: "Join",
            dataIndex: "join",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => router.push(`/ekstrakurikuler/detail/${record?.key}`)}>
                    Lihat Detail
                </Button>
            ),
        });
    }

    return (
        <div>
            <div className="my-5 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: "Ekstrakurikuler",
                        },
                    ]}
                />

                {role !== "siswa" && (
                    <Space>
                        <Link
                            href={{
                                pathname: "/ekstrakurikuler/tambah",
                            }}>
                            <Button
                                type="default"
                                icon={<DeleteOutlined />}
                                size="middle">
                                Tambah
                            </Button>
                        </Link>
                        <Button
                            type="default"
                            danger
                            icon={<DeleteOutlined />}
                            size="middle"></Button>
                    </Space>
                )}
            </div>
            {role === "siswa" && (
                <div className="mb-5">
                    <Alert
                        message="Pemberitahuan"
                        showIcon
                        description={`Perhatikan dengan baik ketika ingin memilih ekstrakurikuler, karena ekstrakurikuler yang dipilih tidak dapat diubah`}
                        type="warning"
                    />
                </div>
            )}
            {pending.length > 0 && (
                <div>
                    <Alert
                        message="Pemberitahuan"
                        showIcon
                        description={`Ada ${pending?.length} ekstrakurikuler yang belum disetujui`}
                        type="warning"
                        action={
                            <Button
                                onClick={() => router.push("/ekstrakurikuler/approve")}
                                size="small"
                                danger>
                                Detail
                            </Button>
                        }
                    />
                </div>
            )}
            {showPending ? (
                <div className="mt-5 flex flex-col gap-3">
                    {ekstrakurikuler?.data?.map(
                        (item) =>
                            item?.approve === false && (
                                <Alert
                                    message={item?.nama}
                                    description={`Diajukan oleh ${item?.pengajar?.nama}`}
                                    type="info"
                                    action={
                                        <Space direction="vertical">
                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={() => handleApprove(item?._id)}>
                                                Approve
                                            </Button>
                                            <Popconfirm
                                                title="Delete the task"
                                                description="Are you sure to delete this task?"
                                                onConfirm={() => handleReject(item?._id)}
                                                onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No">
                                                <Button type="link">Delete</Button>
                                            </Popconfirm>
                                        </Space>
                                    }
                                />
                            )
                    )}
                </div>
            ) : (
                <Table
                    bordered
                    size="large"
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
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
            )}
        </div>
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
