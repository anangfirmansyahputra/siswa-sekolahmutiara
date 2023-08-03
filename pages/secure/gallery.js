import http from '@/plugin/https';
import galleryService from "@/services/gallery.service";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Input, Popconfirm, Space, Table, Typography, message } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

export default function Gallery({ gallery }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);

    const searchInput = useRef(null);
    const data = [];

    gallery?.data.map((item) =>
        data.push({
            key: item._id,
            description: item?.description,
            linkGallery: item?.linkGallery,
            ekstrakurikuler: item?.ekstrakurikuler?.name,
            tglUpload: dayjs(item?.tglUpload).format("DD/MM/YY"),
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

    const columns = [
        {
            title: "Deskripsi",
            dataIndex: "description",
            key: "description",
            ...getColumnSearchProps("description"),
        },
        {
            title: "Ekstrakurikuler",
            dataIndex: "ekstrakurikuler",
            key: "ekstrakurikuler",
            ...getColumnSearchProps("ekstrakurikuler"),
        },
        {
            title: "Tanggal",
            dataIndex: "tglUpload",
            key: "tglUpload",
            ...getColumnSearchProps("tglUpload"),
        },
        {
            title: "Link",
            dataIndex: "linkGallery",
            key: "linkGallery",
            width: 100,
            ...getColumnSearchProps("linkGallery"),
            render: (_, record) => (
                <Link
                    target="_blank"
                    href={{
                        pathname: record?.linkGallery,
                    }}>
                    Lihat
                </Link>
            ),
            fixed: 'right'
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
                <title>Gallery | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Typography.Title level={2}>Data Gallery</Typography.Title>
                <div className="my-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/secure/dashboard">Dashboard</Link>,
                            },
                            {
                                title: "Gallery",
                            },
                        ]}
                    />
                </div>
                <Card>
                    <Table
                        sticky
                        bordered
                        size="large"
                        // style={{
                        //     height: "100",
                        // }}
                        scroll={{
                            x: 800
                        }}
                        columns={columns}
                        dataSource={data}
                    />
                </Card>
            </>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/gallery')
    return {
        props: {
            gallery: data,
        },
    };
}
