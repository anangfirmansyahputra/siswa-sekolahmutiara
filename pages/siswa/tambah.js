import useCreateSiswaContext from "@/context/siswa/useCreateSiswa";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Spin, Typography, Upload } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

Page.layout = "L1";

const { RangePicker } = DatePicker;

const inputs = [
    {
        id: 1,
        name: "name",
        label: "Nama",
        rules: {
            required: true,
            message: "Mohon masukkan nama siswa",
        },
        type: "text",
    },
    {
        id: 2,
        name: "nis",
        label: "NIS",
        rules: {
            required: true,
            message: "Mohon masukkan NIS siswa",
        },
        type: "text",
    },
    {
        id: 3,
        name: "password",
        label: "Password",
        rules: {
            required: true,
            message: "Mohon masukkan password siswa",
        },
        type: "password",
    },
    {
        id: 4,
        name: "alamat",
        label: "Alamat",
        rules: {
            required: true,
            message: "Mohon masukkan alamat siswa",
        },
        type: "text",
    },
    {
        id: 5,
        name: "tgl",
        label: "Tanggal Lahir",
        rules: {
            required: true,
            message: "Mohon masukkan tanggal lahir siswa",
        },
        type: "date",
    },
    {
        id: 6,
        name: "kelas",
        label: "Kelas",
        rules: {
            required: true,
            message: "Mohon masukkan kelas",
        },
        type: "select",
    },
];

export default function Page({ kelas }) {
    const { push } = useRouter();

    // useState
    const [form] = Form.useForm();
    const { loading, handleCreateSiswa } = useCreateSiswaContext(); // Gunakan hook untuk membuat data siswa

    const onFinish = (values) => {
        handleCreateSiswa(values); // Panggil fungsi handleCreateSiswa dengan nilai-nilai form
        form.resetFields();
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