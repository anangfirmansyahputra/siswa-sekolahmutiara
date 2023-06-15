import useCreateEktrakurikuler from "@/context/ektrakurikuler/useCreateEktrakurikuler";
import useDeleteEkstra from "@/context/ektrakurikuler/useDeleteEkstra";
import useUpdateEkstra from "@/context/ektrakurikuler/useUpdateEkstra";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, DatePicker, Divider, Form, Input, InputNumber, Popconfirm, Select, Space, Spin, Switch, message } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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

const inputs = [
    {
        id: 1,
        name: "nama",
        label: "Nama",
        rules: {
            required: true,
            message: "Mohon untuk menginput nama",
        },
        type: "text",
    },
    {
        id: 2,
        name: "waktu",
        label: "Waktu",
        rules: {
            required: true,
            message: "Mohon untuk menginput waktu",
        },
        type: "text",
    },
    {
        id: 3,
        name: "lokasi",
        label: "Lokasi",
        rules: {
            required: true,
            message: "Mohon untuk menginput lokasi",
        },
        type: "textarea",
    },
    {
        id: 4,
        name: "wajib",
        label: "Wajib",
        rules: {
            required: false,
        },
        type: "switch",
    },
    {
        id: 5,
        name: "note",
        label: "Note",
        rules: {
            required: false,
        },
        type: "textarea",
    },
];

export default function Tambah({ ekstrakurikuler }) {
    const { query, push } = useRouter();

    // useState
    const [data, setData] = useState(ekstrakurikuler?.data?.find((item) => item?._id == query?.id));
    const { handleUpdateEkstra, loading } = useUpdateEkstra();
    const [wajib, setWajib] = useState(data?.wajib);
    const [disable, setDisable] = useState(true);

    // useContext
    const { handleDelete } = useDeleteEkstra();

    const [form] = Form.useForm();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const dateFormat = "YYYY/MM/DD";

    const config = {
        headers: { "admin-token": `${token}` },
    };

    useEffect(() => {
        if (data) {
            const formattedDate = dayjs(data.tgl).format("YYYY-MM-DD");
            form.setFieldsValue({ ...data, tgl: dayjs(formattedDate), wajib: wajib });
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

    const confirm = () => {
        handleDelete(data?._id, config)
            .then()
            .catch((err) => console.log(err));
    };

    return (
        <div>
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
                            title: data?.nama,
                        },
                    ]}
                />
            </div>
            <div className="h-fit w-full bg-white p-10">
                <div className="text-end">
                    <Space className="mb-5">
                        <Popconfirm
                            title="Yakin ingin menghapus?"
                            onConfirm={() => confirm()}>
                            <Button
                                type="primary"
                                danger>
                                Delete
                            </Button>
                        </Popconfirm>
                        <Button
                            type="primary"
                            onClick={() => setDisable((prev) => !prev)}>
                            {disable ? "Edit" : "Batal"}
                        </Button>
                    </Space>
                </div>

                <Spin spinning={loading}>
                    <Form
                        disabled={disable}
                        name="basic"
                        layout="horizontal"
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
                                {item?.type === "switch" && (
                                    <Switch
                                        defaultChecked={wajib}
                                        onChange={(checked) => setWajib(checked)}
                                    />
                                )}
                                {item?.type === "password" && <Input.Password size="middle" />}
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
                                    htmlType="reset"
                                    onClick={() => push("/ekstrakurikuler")}>
                                    Batal
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
}
