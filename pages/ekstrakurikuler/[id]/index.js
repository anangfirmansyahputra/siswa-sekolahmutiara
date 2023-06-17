import useDeleteEkstra from "@/context/ektrakurikuler/useDeleteEkstra";
import useUpdateEkstra from "@/context/ektrakurikuler/useUpdateEkstra";
import { Breadcrumb, Typography, Button, Col, Form, Input, InputNumber, Popconfirm, Row, Select, Space, Spin, Switch, TimePicker } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
const { TextArea } = Input;

Tambah.layout = "L1";

let index = 0;

export default function Tambah({ ekstrakurikuler, pengajar }) {
    const { query, push } = useRouter();

    // useState
    const [data, setData] = useState(ekstrakurikuler?.data?.find((item) => item?._id == query?.id));

    const { handleUpdateEkstra, loading } = useUpdateEkstra();
    const [wajib, setWajib] = useState(data.wajib);
    const [disable, setDisable] = useState(true);

    // useContext
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    const config = {
        headers: { "admin-token": `${token}` },
    };

    useEffect(() => {
        if (data) {
            form.setFieldsValue({ ...data, pengajar: data.pengajar._id, waktu: [startTime, endTime], wajib });
        }
    }, [data]);

    const onFinish = (values) => {
        const payload = {
            ...values,
            wajib,
        };

        handleUpdateEkstra(query?.id, { ...payload }, config);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const startTime = dayjs(data?.waktu[0]);
    const endTime = dayjs(data?.waktu[1]);

    return (
        <div>
            <Typography.Title level={2}>Form Edit Ekstrakurikuler</Typography.Title>
            <div className="my-[25px] flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: <Link href="/ekstrakurikuler">Ektrakurikuler</Link>,
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
                        layout="vertical"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Nama Ekstrakurikuler"
                                    name="name">
                                    <Input placeholder="Nama Ekstrakurikuler" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Pengurus"
                                    name="pengajar">
                                    <Select
                                        disabled
                                        placeholder="Pengajar"
                                        options={pengajar?.data?.map((item) => ({
                                            value: item?._id,
                                            label: `${item?.nama} | ${item?.nik}`,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Lokasi"
                                    name="lokasi">
                                    <Input placeholder="Lokasi" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Waktu"
                                            name="waktu">
                                            <TimePicker.RangePicker />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Hari"
                                            name="hari">
                                            <Select
                                                placeholder="Hari"
                                                options={[
                                                    { label: "Senin", value: "senin" },
                                                    { label: "Selasa", value: "selasa" },
                                                    { label: "Rabu", value: "rabu" },
                                                    { label: "Kamis", value: "kamis" },
                                                    { label: "Jumat", value: "jumat" },
                                                    { label: "Sabtu", value: "sabtu" },
                                                    { label: "Minggu", value: "minggu" },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Wajib"
                                    name="wajib">
                                    <Switch
                                        defaultChecked={wajib}
                                        onChange={(value) => setWajib(value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Jumlah Kehadiran"
                                    name="kehadiran">
                                    <InputNumber
                                        placeholder="Minimal 7"
                                        max={100}
                                        min={7}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Note"
                                    name="note">
                                    <TextArea />
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
                                    onClick={() => push("/ekstrakurikuler")}
                                    type="default"
                                    danger
                                    htmlType="reset">
                                    Back
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
}
