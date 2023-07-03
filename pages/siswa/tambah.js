import siswaService from "@/services/siswa.service";
import { Breadcrumb, Button, Col, DatePicker, Form, Input, Row, Select, Space, Spin, Typography, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import http from '@/plugin/https'

Page.layout = "L1";

export default function Page({ kelas }) {
    const { push } = useRouter();
    const [form] = Form.useForm();

    // useState
    const [selectKelas, setSelectKelas] = useState(null);

    const onFinish = async (values) => {
        try {
            const res = await siswaService.create(values);
            message.success(res.message);
            push("/siswa");
        } catch (err) {
            message.error(JSON.parse(err?.request?.response)?.message);
        } finally {
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            <Head>
                <title>Siswa | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Tambah Siswa</Typography.Title>
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
                                title: "Tambah",
                            },
                        ]}
                    />
                </div>
                <div className="h-fit w-full bg-white p-10">
                    <Spin spinning={false}>
                        <Form
                            name="basic"
                            className="w-full"
                            form={form}
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
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
                                <Col span={12}>
                                    <Form.Item
                                        label="Alamat"
                                        name="alamat">
                                        <Input placeholder="Alamat" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Kelas">
                                                <Select
                                                    onChange={(value) => {
                                                        form.setFieldsValue({ kelas: undefined });
                                                        setSelectKelas(value);
                                                    }}
                                                    placeholder="Kelas"
                                                    options={[
                                                        {
                                                            label: 7,
                                                            value: 7,
                                                        },
                                                        {
                                                            label: 8,
                                                            value: 8,
                                                        },
                                                        {
                                                            label: 9,
                                                            value: 9,
                                                        },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Nama Kelas"
                                                name="kelas">
                                                <Select
                                                    disabled={selectKelas === null}
                                                    placeholder="Nama Kelas"
                                                    options={kelas?.data
                                                        ?.filter((item) => item?.kelas == selectKelas)
                                                        ?.map((item) => ({
                                                            label: item?.name,
                                                            value: item?._id,
                                                        }))}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
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

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/kelas')
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
            kelas: data,
        },
    };
}

