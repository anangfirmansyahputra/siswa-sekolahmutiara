import http from '@/plugin/https';
import prestasiService from "@/services/prestasi.service";
import { DeleteOutlined, DownloadOutlined, EditOutlined, FullscreenOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Input, Popconfirm, Space, Typography, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";


const { Meta } = Card;

export default function Prestasi({ kelas, prestasi }) {
    // State
    console.log(prestasi);

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);

    const searchInput = useRef(null);
    const data = [];
    const { push, asPath } = useRouter();

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
        console.log(record);
        try {
            setLoadingFirst(true);
            const res = await prestasiService.delete(record);
            message.success(res?.message);
            push(asPath);
        } catch (err) {
            message.error(err?.message);
        } finally {
            setLoadingFirst(false);
        }
    };

    return (
        <>
            <Head>
                <title>Prestasi | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Typography.Title level={2}>Data Prestasi</Typography.Title>
                <div className="my-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/secure/dashboard">Dashboard</Link>,
                            },
                            {
                                title: "Prestasi",
                            },
                        ]}
                    />
                </div>
                <Input style={{ width: 300, marginBottom: 20 }} />
                <Card>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {prestasi?.data?.map((item) => (
                            <Card
                                className="shadow"
                                cover={
                                    <img
                                        alt={item?.siswa?.name}
                                        src={item?.img}
                                    // height={250}
                                    />
                                }
                                actions={[
                                    <Link
                                        target="_blank"
                                        href={{
                                            pathname: item?.sertifikat,
                                        }}>
                                        <FullscreenOutlined />
                                    </Link>,
                                ]}>
                                <Meta
                                    title={`${item?.deskripsi} (${item?.ekstrakurikuler?.name ?? "Siswa Sudah Dihapus"})`}
                                    description={item?.siswa?.name}
                                />
                            </Card>
                        ))}
                    </div>
                </Card>

            </>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data: prestasi } = await http.get('/prestasi')

    return {
        props: {
            prestasi: prestasi
        },
    };
}

