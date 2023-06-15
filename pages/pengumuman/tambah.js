import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, DatePicker, Form, Input, Space, Spin, Upload } from "antd";
import Link from "next/link";
import React from "react";

Page.layout = "L1";
const { RangePicker } = DatePicker;

const inputs = [
    {
        id: 1,
        name: "title",
        label: "Title",
        rules: {
            required: true,
            message: "Mohon untuk menginput title",
        },
        type: "text",
    },
    {
        id: 2,
        name: "content",
        label: "Content",
        rules: {
            required: true,
            message: "Mohon untuk menginput content",
        },
        type: "text",
    },
    {
        id: 3,
        name: "time",
        label: "Time",
        rules: {
            required: true,
            message: "Mohon untuk menginput tanggal",
        },
        type: "date",
    },
    {
        id: 4,
        name: "file",
        label: "File",
        rules: {
            required: false,
            // message: "Mohon untuk m",
        },
        type: "file",
    },
];

export default function Page() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // console.log("Success:", { ...values, tgl: values.tgl.format(dateFormat) });
        // handleCreatePengajar({ ...values, tgl: values.tgl.format(dateFormat) }, config);
        // form.resetFields();
        console.log(values);
        form.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <div className="my-5 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: <Link href="/pengumuman">Pengumuman</Link>,
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
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                        className="w-full"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        {inputs.map(
                            (item) =>
                                (item?.type === "date" && (
                                    <Form.Item
                                        labelAlign="left"
                                        key={item?.id}
                                        name={item?.name}
                                        label={item?.label}
                                        rules={[item?.rules]}>
                                        <RangePicker />
                                    </Form.Item>
                                )) ||
                                (item?.type === "text" && (
                                    <Form.Item
                                        labelAlign="left"
                                        key={item?.id}
                                        name={item?.name}
                                        label={item?.label}
                                        rules={[item?.rules]}>
                                        {item?.type === "text" && <Input size="middle" />}
                                    </Form.Item>
                                )) ||
                                (item?.type === "file" && (
                                    <Form.Item
                                        labelAlign="left"
                                        key={item?.id}
                                        name={item?.name}
                                        label={item?.label}
                                        rules={[item?.rules]}
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}>
                                        <Upload
                                            action="/upload.do"
                                            listType="picture-card">
                                            <div>
                                                <PlusOutlined />
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                    }}>
                                                    Upload
                                                </div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                ))
                        )}

                        <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit">
                                    Submit
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    htmlType="reset">
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
}
