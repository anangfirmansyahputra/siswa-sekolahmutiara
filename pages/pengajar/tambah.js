import { Breadcrumb, Divider, Space, Spin } from "antd";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, TreeSelect, Upload } from "antd";
import { inputs } from "@/constants";
import { useRef, useState } from "react";
import useCreatePengajarContext from "@/context/useCreatePengajarContext";
import { useSession } from "next-auth/react";
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

export default function Tambah() {
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const dateFormat = "YYYY/MM/DD";

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = (values) => {
        console.log("Success:", { ...values, tgl: values.tgl.format(dateFormat) });
        handleCreatePengajar({ ...values }, config);
        // form.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const [items, setItems] = useState(["Biologi", "Fisika"]);
    const [name, setName] = useState("");
    const inputRef = useRef(null);
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName("");
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const { handleCreatePengajar, loading } = useCreatePengajarContext();

    return (
        <div>
            <div className="my-[25px] flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: <Link href="/pengajar">Pengajar</Link>,
                        },
                        {
                            title: "Tambah",
                        },
                    ]}
                />
            </div>
            <div className="h-fit w-full bg-white p-10">
                <Spin spinning={loading}>
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
                        {inputs.map((item) => (
                            <Form.Item
                                labelAlign="left"
                                key={item?.id}
                                name={item?.name}
                                label={item?.label}
                                rules={[item?.rules]}>
                                {item?.type === "password" && <Input.Password size="middle" />}
                                {item?.type === "date" && <DatePicker format={dateFormat} />}
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
                        ))}

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
