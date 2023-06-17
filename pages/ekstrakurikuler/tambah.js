import useCreateEktrakurikuler from "@/context/ektrakurikuler/useCreateEktrakurikuler";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Space, Spin, Switch, TimePicker, Typography } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

Tambah.layout = "L1";

let index = 0;

export default function Tambah({ pengajar }) {
    // useState
    const [wajib, setWajib] = useState(false);

    const { push } = useRouter();
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const { handleCreateEktrakurikuler, loading } = useCreateEktrakurikuler();

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = (values) => {
        const payload = {
            ...values,
            wajib,
        };

        console.log(payload);

        handleCreateEktrakurikuler({ ...payload }, config);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div>
            <Typography.Title level={2}>Form Tambah Ekstrakurikuler</Typography.Title>
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
                            title: "Tambah",
                        },
                    ]}
                />
            </div>
            <div className="h-fit w-full bg-white p-10 shadow-lg">
                <Spin spinning={loading}>
                    <Form
                        name="basic"
                        layout="vertical"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        {/* {inputs.map((item) => (
                            <Form.Item
                                labelAlign="left"
                                key={item?.id}
                                name={item?.name}
                                label={item?.label}
                                rules={[item?.rules]}>
                                {item?.type === "password" && <Input.Password size="middle" />}
                                {item?.type === "switch" && <Switch onChange={(checked) => setWajib(checked)} />}
                                {item?.type === "date" && <DatePicker format={dateFormat} />}
                                {item?.type === "textarea" && <TextArea rows={4} />}
                                {item?.type === "text" && <Input size="middle" />}
                                {item?.type === "select" && (
                                    <Select
                                        style={{
                                            width: 300,
                                        }}
                                        placeholder="custom dropdown render"
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                        margin: "8px 0",
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                        padding: "0 8px 4px",
                                                    }}>
                                                    <Input
                                                        placeholder="Please enter item"
                                                        ref={inputRef}
                                                        value={name}
                                                        onChange={onNameChange}
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={<PlusOutlined />}
                                                        onClick={addItem}>
                                                        Add item
                                                    </Button>
                                                </Space>
                                            </>
                                        )}
                                        options={items.map((item) => ({
                                            label: item,
                                            value: item,
                                        }))}
                                    />
                                )}
                                {item?.type === "number" && (
                                    <InputNumber
                                        size="middle"
                                        style={{
                                            width: "100%",
                                        }}
                                    />
                                )}
                            </Form.Item>
                        ))} */}

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
                                            <TimePicker.RangePicker format="HH:mm" />
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
                                    <Switch onChange={(value) => setWajib(value)} />
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
