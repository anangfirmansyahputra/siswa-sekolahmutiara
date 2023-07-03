import galleryService from "@/services/gallery.service";
import kelasService from "@/services/kelas.service";
import { Breadcrumb, Button, Col, Form, Input, Row, Select, Space, Spin, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import http from '@/plugin/https'

Tambah.layout = "L1";

export default function Tambah({ ekstrakurikuler }) {
    const [form] = Form.useForm();
    const [loadingFirst, setLoadingFirst] = useState(true);
    const { push } = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = async (values) => {
        try {
            const res = await galleryService.create(values);
            message.success(res.message);
            push("/gallery");
        } catch (err) {
            message.success(err.message);
        } finally {
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    useEffect(() => {
        setLoadingFirst(false);
    }, []);

    return (
        <>
            <Head>
                <title>Form Gallery | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Gallery</Typography.Title>
                <div className="my-[25px] flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: <Link href="/gallery">Gallery</Link>,
                            },
                            {
                                title: "Tambah",
                            },
                        ]}
                    />
                </div>
                <div className="h-fit w-full bg-white p-10 shadow-lg">
                    <Spin spinning={loadingFirst}>
                        <Form
                            name="basic"
                            form={form}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ekstrakurikuler"
                                        name="ekstrakurikuler">
                                        <Select
                                            placeholder="Ekstrakurikuler"
                                            options={ekstrakurikuler?.data?.map((item) => ({
                                                label: item?.name,
                                                value: item?._id,
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Title"
                                        name="description">
                                        <Input placeholder="Title" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Link Images"
                                        name="linkGallery">
                                        <Input placeholder="Link Gallery" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button
                                        onClick={() => push("/gallery")}
                                        type="default"
                                        danger
                                        htmlType="button">
                                        Back
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Spin>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/pengajar/ekstrakurikuler')
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
            ekstrakurikuler: data,
        },
    };
}
