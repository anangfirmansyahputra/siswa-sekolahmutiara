import absenService from "@/services/absen.service";
import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Form, Input, Layout, Modal, Row, Select, Space, Table, Typography, message } from "antd";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";

Page.layout = "L1";
const { Content } = Layout

export default function Page({ ekstrakurikuler, kelas }) {
    const { query, push, asPath } = useRouter()
    const [form] = Form.useForm()

    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [loading, setLoading] = useState(false)

    const [pertemuan, setPertemuan] = useState(0)
    const [kelasId, setKelasId] = useState("")

    const searchInput = useRef(null);
    const data = [];
    const dataAbsen = []
    const filterEsktrakurikuler = ekstrakurikuler?.data?.find(item => item?._id === query?.id)

    filterEsktrakurikuler?.pendaftar?.map(item => (
        data.push({
            key: item?._id,
            name: item?.name,
            nis: item?.nis,
            kelas: `${item?.kelas?.kelas} ${item?.kelas?.name}`,
            pertemuan1: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[0],
            pertemuan2: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[1],
            pertemuan3: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[2],
            pertemuan4: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[3],
            pertemuan5: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[4],
            pertemuan6: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[5],
            pertemuan7: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[6],
            pertemuan8: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[7],
            pertemuan9: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[8],
            pertemuan10: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[9],
            pertemuan11: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[10],
            pertemuan12: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[11],
            pertemuan13: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[12],
            pertemuan14: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[13],
        })
    ))

    filterEsktrakurikuler?.pendaftar?.filter(item => item.kelas?._id === kelasId).map(item => (
        dataAbsen.push({
            key: item?._id,
            name: item?.name,
            nis: item?.nis,
            kehadiran: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[pertemuan],
        })
    ))

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

    let absenColumn = []

    for (let i = 1; i <= 14; i++) {
        absenColumn.push({
            title: `Pertemuan ${i}`,
            dataIndex: `pertemuan${i}`,
            key: `pertemuan${i}`,
            width: "120px",
            align: "center",
            render: (_, record) => (
                <span>{record[`pertemuan${i}`] ? <CheckOutlined style={{
                    color: "green"
                }} /> : <CloseOutlined style={{
                    color: "red"
                }} />}</span>
            )
        },)
    }

    const columns = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            width: "fit",
            ...getColumnSearchProps("name"),
            fixed: "left",
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/ekstrakurikuler/${record?.key}`,
                    }}>
                    {record?.name}
                </Link>
            ),
        },
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis",
            ...getColumnSearchProps("nis"),
        },
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas",
            ...getColumnSearchProps("kelas"),
        },
        ...absenColumn
    ];

    const columnsAbsen = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            width: "fit",
            ...getColumnSearchProps("name"),
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/ekstrakurikuler/${record?.key}`,
                    }}>
                    {record?.name}
                </Link>
            ),
        },
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis",
            ...getColumnSearchProps("nis"),
        },
        {
            title: `Pertemuan ${pertemuan + 1}`,
            dataIndex: "kehadiran",
            key: "kehadiran",
            align: "center",
            render: (_, record) => record?.kehadiran ? <CheckOutlined style={{
                color: "green"
            }} /> : <CloseOutlined style={{
                color: "red"
            }} />
        }
    ];

    const listPertemuan = []

    for (let i = 0; i < 14; i++) {
        listPertemuan.push({
            label: i + 1,
            value: i
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            // Column configuration not to be checked
            name: record.name,
        }),
        selectedRowKeys,
    };

    const handleAbsen = async () => {
        setLoading(true)
        const payload = {
            kelas: kelasId,
            pertemuan,
            ekstrakurikuler: filterEsktrakurikuler._id,
            listSiswa: selectedRowKeys
        }
        try {
            if (dataAbsen.length > 0) {
                const confirm = await Swal.fire({
                    title: 'Yakin ingin mengubah data absen?',
                    // showCancelButton: true,
                    showDenyButton: true,
                    icon: 'question',
                    confirmButtonText: 'Yakin',
                    denyButtonText: `Kembali`,
                })

                if (confirm.isConfirmed) {
                    const res = await absenService.absen(payload)
                    message.success(res?.message)
                    setModalOpen(false)
                    push(asPath)
                    form.resetFields()
                } else {
                    // form.resetFields()
                }
            }
        } catch (err) {
            message.error(err?.response?.data?.message || err.message);
            setModalOpen(false)
            push(asPath)
        } finally {
            setLoading(false)
            setRowKeys([])
        }
    }

    console.log(dataAbsen);

    return (
        <>
            <Head>
                <title>Absensi | Sistem Informasi Mutiara</title>
            </Head>
            <Content>
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
                                title: <Link href={{
                                    pathname: "/absensi"
                                }}>Absensi</Link>
                            },
                            {
                                title: filterEsktrakurikuler?.name
                            }
                        ]} />
                    </div>
                    <Button icon={<EditOutlined />} onClick={() => setModalOpen(true)} type="primary">Edit Absensi</Button>
                </div>

                <Card>
                    <Table
                        bordered
                        size="large"
                        style={{
                            height: "100",
                            marginTop: 10,
                        }}
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: "2500px",
                        }}
                    />
                </Card >

                <Modal
                    title="Absensi"
                    style={{
                        top: 20,
                    }}
                    width={"60vw"}
                    open={modalOpen}
                    onOk={() => setModalOpen(false)}
                    onCancel={() => {
                        if (!loading) {
                            setModalOpen(false)
                            form.resetFields()
                        }
                    }}
                    footer={
                        [
                            <Button type="primary" loading={loading} onClick={handleAbsen}>Simpan</Button>
                        ]
                    }
                >
                    <div className="p-5">
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Pertemuan" name="pertemuan">
                                        <Select options={listPertemuan} value={pertemuan} onChange={(value) => {
                                            setRowKeys([]);
                                            setPertemuan(value);
                                        }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Kelas" name="kelas">
                                        <Select value={kelasId} onChange={(value) => {
                                            setRowKeys([])
                                            setKelasId(value)
                                        }} options={kelas?.data?.map(item => ({
                                            value: item?._id,
                                            label: `${item?.kelas} ${item?.name}`
                                        }))} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                        <Table loading={loading} dataSource={dataAbsen} columns={columnsAbsen} rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }} />

                    </div>
                </Modal>

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
