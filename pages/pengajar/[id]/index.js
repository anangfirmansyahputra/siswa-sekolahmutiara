import { inputs } from "@/constants";
import useCreatePengajarContext from "@/context/useCreatePengajarContext";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Space, Spin, Typography } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import useUpdatePengajar from "@/context/pengajar/useUpdatePengajar";
import Head from "next/head";
import http from '@/plugin/https'

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
    const [loadingFirst, setLoadingFirst] = useState(true);
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

    useEffect(() => {
        setLoadingFirst(false);
    }, []);

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
        // <div>
        //     <div className="my-[25px] flex items-center justify-between">
        //         <Breadcrumb
        //             items={[
        //                 {
        //                     title: <Link href="/">Dashboard</Link>,
        //                 },
        //                 {
        //                     title: <Link href="/pengajar">Pengajar</Link>,
        //                 },
        //                 {
        //                     title: "Edit",
        //                 },
        //             ]}
        //         />
        //     </div>
        //     <div className="h-fit w-full bg-white p-10">
        //         <Spin spinning={loading}>
        //             <Form
        //                 name="basic"
        //                 labelCol={{ span: 3 }}
        //                 wrapperCol={{ span: 21 }}
        //                 className="w-full"
        //                 form={form}
        //                 initialValues={{ remember: true }}
        //                 onFinish={onFinish}
        //                 onFinishFailed={onFinishFailed}
        //                 autoComplete="off">
        //                 {inputs.map((item) => (
        //                     <Form.Item
        //                         labelAlign="left"
        //                         key={item?.id}
        //                         name={item?.name}
        //                         label={item?.label}
        //                         rules={[item?.rules]}>
        //                         {item?.type === "password" && <Input.Password size="middle" />}
        //                         {item?.type === "date" && <DatePicker format={dateFormat} />}
        //                         {item?.type === "text" && <Input size="middle" />}
        //                         {item?.type === "select" && (
        //                             <Select
        //                                 style={{
        //                                     width: 300,
        //                                 }}
        //                                 placeholder="custom dropdown render"
        //                                 dropdownRender={(menu) => (
        //                                     <>
        //                                         {menu}
        //                                         <Divider
        //                                             style={{
        //                                                 margin: "8px 0",
        //                                             }}
        //                                         />
        //                                         <Space
        //                                             style={{
        //                                                 padding: "0 8px 4px",
        //                                             }}>
        //                                             <Input
        //                                                 placeholder="Please enter item"
        //                                                 ref={inputRef}
        //                                                 value={name}
        //                                                 onChange={onNameChange}
        //                                             />
        //                                             <Button
        //                                                 type="text"
        //                                                 icon={<PlusOutlined />}
        //                                                 onClick={addItem}>
        //                                                 Add item
        //                                             </Button>
        //                                         </Space>
        //                                     </>
        //                                 )}
        //                                 options={items.map((item) => ({
        //                                     label: item,
        //                                     value: item,
        //                                 }))}
        //                             />
        //                         )}
        //                         {item?.type === "number" && (
        //                             <InputNumber
        //                                 size="middle"
        //                                 style={{
        //                                     width: "100%",
        //                                 }}
        //                             />
        //                         )}
        //                     </Form.Item>
        //                 ))}

        //                 <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
        //                     <Space>
        //                         <Button
        //                             type="primary"
        //                             htmlType="submit">
        //                             Ubah
        //                         </Button>
        //                         <Button
        //                             onClick={() => push("/pengajar")}
        //                             type="primary"
        //                             danger
        //                             htmlType="button">
        //                             Batal
        //                         </Button>
        //                     </Space>
        //                 </Form.Item>
        //             </Form>
        //         </Spin>
        //     </div>
        // </div>
        <>
            <Head>
                <title>Form Edit Pengajar | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Edit Pengajar</Typography.Title>
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
                    <Spin spinning={loadingFirst}>
                        <Form
                            name="basic"
                            form={form}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout="vertical">
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Nama Lengkap"
                                        name="nama">
                                        <Input placeholder="Nama Lengkap" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="NIK"
                                        name="nik">
                                        <Input placeholder="NIK" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password">
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Mengajar"
                                        name="mengajar">
                                        <Select
                                            style={{
                                                width: "100%",
                                            }}
                                            placeholder="Mengajar"
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
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tanggal Lahir"
                                        name="tgl">
                                        <DatePicker
                                            format={dateFormat}
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
                                    <Form.Item
                                        label="Nomor Telp"
                                        name="noTelp">
                                        <Input placeholder="Nomor Telp" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit">
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => push("/pengajar")}
                                        type="default"
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
    const { data } = await http.get('/admin/pengajar')
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
            pengajar: data,
        },
    };
}

