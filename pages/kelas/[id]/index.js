import kelasService from "@/services/kelas.service";
import { Breadcrumb, Button, Col, Form, Input, Row, Select, Space, Spin, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

Edit.layout = "L1";

export default function Edit({ kelas }) {
    const [form] = Form.useForm();
    const { push, query } = useRouter();
    const { data: session } = useSession();

    const [loadingFirst, setLoadingFirst] = useState(true);
    const [data, setData] = useState(kelas?.data?.find((item) => item?._id == query?.id));
    const token = session?.user?.user?.accessToken;

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = async (values) => {
        const payload = {
            name: values.kelas + " " + values.name,
        };

        try {
            const res = await kelasService.edit(payload, query.id);
            message.success(res.message);
            push("/kelas");
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
            const split = data.name.split(" ");
            const name = split[1];
            const kelas = split[0];

            form.setFieldsValue({ name, kelas });
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
                                        label="Kelas"
                                        name="kelas">
                                        <Select
                                            placeholder="Kelas"
                                            options={[
                                                { label: "7", value: "7" },
                                                { label: "8", value: "8" },
                                                { label: "9", value: "9" },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Nama Lengkap"
                                        name="name">
                                        <Input placeholder="Nama Lengkap" />
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
                                        onClick={() => push("/kelas")}
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
