import { selecUser, setUser } from "@/redux/slices/userSlices";
import authService from "@/services/auth.service";
import pengumumanService from "@/services/pengumuman.service";
import siswaService from "@/services/siswa.service";
import { Alert, Button, Card, Col, DatePicker, Descriptions, Form, Image, Input, Modal, Row, Select, Typography, theme } from "antd";
import dayjs from "dayjs";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Marquee from 'react-fast-marquee';
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";


export default function Dashboard(props) {
    const user = useSelector(selecUser)
    const [loading, setIsLoading] = useState(true)
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const router = useRouter()

    // State
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(false)
        form.setFieldsValue({ name: user?.name, nis: user?.nis, gender: user?.gender, bop: user?.bop, alamat: user?.alamat, tgl: dayjs(user?.tgl), noTlp: user?.noTlp })
    }, [])

    console.log(props);


    const handleSubmit = (values) => {
        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: "Data akan dirubah",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await siswaService.edit(values, user._id)
                    const token = localStorage.getItem('siswa-token')
                    const me = await authService.me({ token })
                    dispatch(setUser(me.data))

                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: "Data berhasil diupdate"
                    })
                    router.push(router.asPath)
                    setModalOpen(false)
                    form.resetFields()
                } catch (err) {
                    console.log(err);
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }

    return (
        <>
            <Head>
                <title>Dashboard | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <div className="pb-10">
                <Typography.Title level={2}>Dashboard</Typography.Title>
                {!loading && (
                    <div className="flex items-start gap-5 flex-col md:flex-row">
                        <Card className="md:w-[95%] w-full" loading={loading}>
                            <Descriptions title="Biodata" bordered column={{
                                xxl: 2,
                                xl: 2,
                                lg: 2,
                                md: 1,
                                sm: 1,
                                xs: 1
                            }}>
                                <Descriptions.Item label="Nama">{user?.name}</Descriptions.Item>
                                <Descriptions.Item label="NIS">{user?.nis}</Descriptions.Item>
                                <Descriptions.Item label="Kelas">{user?.kelas?.kelas + " " + user?.kelas?.name}</Descriptions.Item>
                                <Descriptions.Item label="Tempat Lahir">{user?.bop}</Descriptions.Item>
                                <Descriptions.Item label="Tanggal Lahir">{dayjs(user?.tgl).format('YYYY-MM-DD')}</Descriptions.Item>
                                <Descriptions.Item label="Alamat">{user?.alamat}</Descriptions.Item>
                                <Descriptions.Item label="Jenis Kelamin">{user?.gender === "L" ? "Laki - laki" : "Perempuan"}</Descriptions.Item>
                                {/* <Descriptions.Item label="Prestasi">0</Descriptions.Item> */}
                            </Descriptions>

                            <div className="mt-4 flex justify-end">
                                <Button type="primary" onClick={() => setModalOpen(true)}>Update Biodata</Button>
                            </div>
                        </Card>

                        <div className="md:w-[33%] w-full">
                            <Image
                                className="rounded-lg"
                                width={"100%"}
                                // src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                            />
                        </div>

                    </div>
                )}

                <Card className="mt-5">
                    {props?.pengumuman?.data?.map(item => (
                        <Alert
                            type="success"
                            icon={<span></span>}
                            key={item?._id}
                            style={{
                                marginBottom: 10
                            }}
                            banner
                            message={
                                <>
                                    <Typography.Title level={5}>{item?.title}</Typography.Title>
                                    <Marquee pauseOnHover gradient={false} style={{
                                        height: 40
                                    }}>
                                        {item?.content}
                                    </Marquee>
                                </>
                            }
                        />
                    ))}
                </Card>

                <Modal
                    title="Update Biodata"
                    className="top-[20px]"
                    open={modalOpen}
                    onOk={() => form.submit()}
                    onCancel={() => setModalOpen(false)}
                    okText="Update"
                    cancelText="Batal"
                >
                    <div className="p-5">
                        <Form layout="vertical" form={form} onFinish={handleSubmit}>
                            <Row gutter={16}>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="name" label="Nama">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="nis" label="NIS">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="gender" label="Jenis Kelamin">
                                        <Select placeholder="Pilih" options={[
                                            {
                                                label: "Laki - laki",
                                                value: "L"
                                            },
                                            {
                                                label: "Perempuan",
                                                value: "P"
                                            },
                                        ]} disabled />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="alamat" label="Alamat">
                                        <Input placeholder="" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="bop" label="Tempat Lahir">
                                        <Input placeholder="Masukan daerah tempat lahir" />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="tgl" label="Tanggal Lahir">
                                        <DatePicker style={{
                                            width: "100%"
                                        }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    <Form.Item name="noTlp" label="No Telp">
                                        <Input placeholder="Masukan nomor telepon" />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={24} sm={24} xs={24}>
                                    {/* <Form.Item name="tgl" label="Tanggal Lahir">
                                        <DatePicker style={{
                                            width: "100%"
                                        }} /> */}
                                    {/* </Form.Item> */}
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const pengumuman = await pengumumanService.get({
        for: 'siswa'
    })

    return {
        props: {
            pengumuman: pengumuman
        }
    }
}