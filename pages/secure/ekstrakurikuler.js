import { selecUser, setUser } from "@/redux/slices/userSlices";
import authService from "@/services/auth.service";
import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Descriptions, Modal, Space, Table, Tag, Typography, message } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const { confirm } = Modal

export default function EkstrakurikulerPage({ ekstrakurikuler }) {
    const user = useSelector(selecUser)
    const dispatch = useDispatch()
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idEkstra, setIdEkstra] = useState()
    const [ekstra, setEkstra] = useState(null)
    const data = (ekstrakurikuler.data.map(item => ({
        key: item._id,
        name: item.name,
        pendaftar: item.pendaftar.length,
        lokasi: item.lokasi,
        waktu: `${dayjs(item.waktu[0]).format('HH:mm')} - ${dayjs(item.waktu[1]).format('HH:mm')}`,
        hari: item.hari,
        wajib: item.wajib,
        pengajar: item?.pengajar?.nama,
        note: item.note
    })))
    const selectedData = (data.find(item => item.key === idEkstra))

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        showConfirm()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleJoin = async () => {
        console.log(ekstra);

        try {
            const res = await ekstrakurikulerService.join({
                nis: user?.nis,
                ekstraId: ekstra.key
            })

            const token = localStorage.getItem('siswa-token')
            const me = await authService.me({ token })
            dispatch(setUser(me.data))

            message.success('Bergabung berhasil, sedang menunggu approve dari pembimbing ekstrakurikuler')
            handleCancel()
            router.push(router.asPath)
        } catch (err) {
            console.log(err);
            message.error('Bergabung gagal, silahkan coba kembali')
        }
    }

    const columns = [
        {
            title: 'Ekstrakurikuler',
            dataIndex: 'name',
            key: 'name',
            fixed: "left"
        },
        {
            title: 'Pendaftar',
            dataIndex: 'pendaftar',
            key: 'pendaftar',
        },
        {
            title: 'Pembina',
            dataIndex: 'pengajar',
            key: 'pengajar',
        },
        {
            title: 'Hari',
            dataIndex: 'hari',
            key: 'hari',
            render: (_, record) => (
                <span className="capitalize">{record.hari}</span>
            )
        },
        {
            title: 'Waktu',
            dataIndex: 'waktu',
            key: 'waktu',
        },
        {
            title: 'Status',
            key: 'tipe',
            dataIndex: 'tipe',
            render: (_, { wajib }) => (
                <>
                    <Tag color={!wajib ? "yellow" : "green"} key={wajib}>
                        {wajib ? "Wajib" : "Pilihan"}
                    </Tag>
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                record?.wajib ? (
                    user?.nilai?.ekstrakurikulerWajib?.ekstrakurikuler === null && !user?.alredyWajib ?
                        <Button type="link" size="small" onClick={() => {
                            setIdEkstra(record.key)
                            setEkstra(record)
                            showModal()
                        }}>Gabung</Button>
                        : <Button danger type="link" size="small">{
                            user?.alredyWajib ? "Menunggu Approve" : "Sudah Bergabung"
                        }</Button>

                ) :
                    user?.nilai?.ekstrakurikulerPilihan?.ekstrakurikuler === null && !user?.alredyPilihan ?
                        <Button type="link" size="small" onClick={() => {
                            setIdEkstra(record.key)
                            setEkstra(record)
                            showModal()
                        }}>Gabung</Button>
                        : <Button danger type="link" size="small">
                            {
                                user?.alredyPilihan ? "Menunggu Approve" : "Sudah Bergabung"
                            }
                        </Button>
            ),
            fixed: 'right'
        },
    ];

    const showConfirm = () => {
        Swal.fire({
            title: "Apa kamu yakin?",
            text: "Ekstrakurikuler yang dipilih tidak dapat dirubah!",
            icon: "question",
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yakin",
            denyButtonText: "Batal"
        }).then((result) => {
            handleJoin()
        })
    };

    return (
        <>
            <Head>
                <title>Ekstrakurikuler | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <div className="pb-10">
                <Typography.Title level={2}>Ekstrakurikuler</Typography.Title>
                <Breadcrumb items={[
                    {
                        title: "Dashboard"
                    },
                    {
                        title: "Ekstrakurikuler"
                    }
                ]} />
                <Card className="mt-5">
                    <Table scroll={{
                        x: 800
                    }} bordered columns={columns} dataSource={data} />
                </Card>
                <Modal okButtonProps={() => alert('tai')} className="top-[20px]" title="Info Ekstrakurikuler" okText="Gabung" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div className="p-5">
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Nama">{selectedData?.name}</Descriptions.Item>
                            <Descriptions.Item label="Tipe">{selectedData?.wajib ? "Wajib" : "Pilihan"}</Descriptions.Item>
                            <Descriptions.Item label="Pendaftar">{selectedData?.pendaftar}</Descriptions.Item>
                            <Descriptions.Item label="Hari">{selectedData?.hari}</Descriptions.Item>
                            <Descriptions.Item label="Jam">{selectedData?.waktu}</Descriptions.Item>
                            <Descriptions.Item label="Lokasi">{selectedData?.lokasi}</Descriptions.Item>
                            <Descriptions.Item label="Note">
                                <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedData?.note}</pre>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const resData = await ekstrakurikulerService.get()

    return {
        props: {
            ekstrakurikuler: resData
        }
    }
}