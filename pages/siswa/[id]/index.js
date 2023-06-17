import siswaService from "@/services/siswa.service";
import { Breadcrumb, Button, Col, DatePicker, Form, Input, Row, Space, Spin, Typography, message } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

Page.layout = "L1";

export default function Page({ kelas, siswa }) {
    const { query, push } = useRouter();

    // useState
    const [data, setData] = useState(siswa?.data?.find((item) => item?.nis == query?.id));
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await siswaService.edit(values, data?._id);
            form.resetFields();
            message.success("Edit siswa success");
            push("/siswa");
        } catch (err) {
            message.error("Edit siswa failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            const formattedDate = dayjs(data.tgl).format("YYYY-MM-DD");
            form.setFieldsValue({ ...data, tgl: dayjs(formattedDate) });
        }
    }, [data]);

    return (
        <>
            <Head>
                <title>Siswa | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Edit Siswa</Typography.Title>
                <div className="my-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: <Link href="/siswa">Siswa</Link>,
                            },
                            {
                                title: data?.name,
                            },
                        ]}
                    />
                </div>
                <div className="h-fit w-full bg-white p-10">
                    <Spin spinning={loading}>
                        <Form
                            name="basic"
                            className="w-full"
                            form={form}
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Nama Lengkap"
                                        name="name">
                                        <Input placeholder="Nama Lengkap" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="NIS"
                                        name="nis">
                                        <Input placeholder="NIS" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password">
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tanggal Lahir"
                                        name="tgl">
                                        <DatePicker
                                            style={{
                                                width: "100%",
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Alamat"
                                        name="alamat">
                                        <Input placeholder="Alamat" />
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
                                        type="default"
                                        onClick={() => push("/siswa")}
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
