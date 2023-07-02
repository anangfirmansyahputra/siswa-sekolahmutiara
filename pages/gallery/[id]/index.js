import galleryService from "@/services/gallery.service";
import kelasService from "@/services/kelas.service";
import { Breadcrumb, Button, Col, Form, Input, Row, Select, Space, Spin, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

Edit.layout = "L1";

export default function Edit({ ekstrakurikuler, gallery }) {
    const [form] = Form.useForm();
    const { push, query } = useRouter();
    const { data: session } = useSession();

    const [loadingFirst, setLoadingFirst] = useState(true);
    const [data, setData] = useState(gallery?.data?.find((item) => item?._id == query?.id));
    const token = session?.user?.user?.accessToken;

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = async (values) => {
        try {
            const res = await galleryService.update(values, query.id);
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

    useEffect(() => {
        if (data) {
            form.setFieldsValue({ ...data, ekstrakurikuler: data.ekstrakurikuler._id });
        }
    }, [data]);

    return (
        <>
            <Head>
                <title>Form Kelas | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Pengajar</Typography.Title>
                <div className="my-[25px] flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: <Link href="/pengajar">Kelas</Link>,
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
                                            disabled
                                            placeholder="Ekstrakurikuler"
                                            value={data?.ekstrakurikuler?.id}
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
