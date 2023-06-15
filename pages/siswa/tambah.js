import useCreateSiswaContext from "@/context/siswa/useCreateSiswa";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, DatePicker, Divider, Form, Input, Select, Space, Spin, Upload } from "antd";
import Link from "next/link";
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
    // useState
    const inputRef = useRef(null);
    const [name, setName] = useState("");
    const [items, setItems] = useState(kelas?.data);

    const [form] = Form.useForm();
    const { loading, handleCreateSiswa } = useCreateSiswaContext(); // Gunakan hook untuk membuat data siswa

    const onFinish = (values) => {
        handleCreateSiswa(values); // Panggil fungsi handleCreateSiswa dengan nilai-nilai form
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

    return (
        <div>
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
                                key={item.id}
                                name={item.name}
                                label={item.label}
                                rules={[item.rules]}>
                                {item.type === "date" && <DatePicker />}
                                {item.type === "text" && <Input size="middle" />}
                                {item.type === "file" && (
                                    <Upload
                                        action="/upload.do"
                                        listType="picture-card">
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                )}
                                {item.type === "password" && <Input.Password />}
                                {item?.type === "select" && (
                                    <Select
                                        style={{
                                            width: "300px",
                                        }}
                                        placeholder="Pilih Kelas"
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
                                            label: item?.name,
                                            value: item?._id,
                                        }))}
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
