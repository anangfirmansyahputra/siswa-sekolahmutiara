import { inputs } from "@/constants";
import useCreatePengajarContext from "@/context/useCreatePengajarContext";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, DatePicker, Divider, Form, Input, InputNumber, Select, Space, Spin } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import useUpdatePengajar from "@/context/pengajar/useUpdatePengajar";

dayjs.locale("id");

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

Edit.layout = "L1";

let index = 0;

export default function Edit({ pengajar }) {
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const { query, push } = useRouter();

    const token = session?.user?.user?.accessToken;
    const dateFormat = "YYYY-MM-DD";
    const [data, setData] = useState(pengajar?.data?.find((item) => item?.nik == query?.id));
    const { handleUpdatePengajar, loading } = useUpdatePengajar();

    const config = {
        headers: { "admin-token": `${token}` },
    };

    useEffect(() => {
        if (data) {
            const formattedDate = dayjs(data.tgl).format("YYYY-MM-DD");
            form.setFieldsValue({ ...data, tgl: dayjs(formattedDate) });
        }
    }, [data]);

    const onFinish = (values) => {
        handleUpdatePengajar({ ...values, tgl: values.tgl.format(dateFormat) }, config, Number(query?.id));
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
                            title: "Edit",
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
                                    Ubah
                                </Button>
                                <Button
                                    onClick={() => push("/pengajar")}
                                    type="primary"
                                    danger
                                    htmlType="button">
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
