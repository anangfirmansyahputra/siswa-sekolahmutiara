import useCreatePengajarContext from "@/context/useCreatePengajarContext";
import matpelService from "@/services/matpel.service";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Spin, Typography } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

Tambah.layout = "L1";

let index = 0;

export default function Tambah({ matpel }) {
    const [form] = Form.useForm();
    const [loadingFirst, setLoadingFirst] = useState(true);
    const { push } = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const dateFormat = "YYYY/MM/DD";

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = (values) => {
        handleCreatePengajar({ ...values }, config);
        form.resetFields();
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

    useEffect(() => {
        setLoadingFirst(false);
    }, []);

    const [isLengthValid, setIsLengthValid] = useState(true);

    const validateLength = (_, value) => {
        if (value && value.length !== 19) {
            setIsLengthValid(false);
            return Promise.reject(new Error("Panjang harus tepat 19 karakter"));
        }
        setIsLengthValid(true);
        return Promise.resolve();
    };

    return (
        <>
            <Head>
                <title>Form Pengajar | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Pengajar</Typography.Title>
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
                <div className="h-fit w-full bg-white p-10 shadow-lg">
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
                                        name="nik"
                                        label="NIK"
                                        validateStatus={isLengthValid ? "success" : "error"}
                                        help={!isLengthValid && "Panjang harus tepat 19 karakter"}
                                        rules={[{ validator: validateLength }]}>
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
                                            // dropdownRender={(menu) => (
                                            //     <>
                                            //         {menu}
                                            //         <Divider
                                            //             style={{
                                            //                 margin: "8px 0",
                                            //             }}
                                            //         />
                                            //         <Space
                                            //             style={{
                                            //                 padding: "0 8px 4px",
                                            //             }}>
                                            //             <Input
                                            //                 placeholder="Please enter item"
                                            //                 ref={inputRef}
                                            //                 value={name}
                                            //                 onChange={onNameChange}
                                            //             />
                                            //             <Button
                                            //                 type="text"
                                            //                 icon={<PlusOutlined />}
                                            //                 onClick={addItem}>
                                            //                 Add item
                                            //             </Button>
                                            //         </Space>
                                            //     </>
                                            // )}
                                            options={matpel?.data?.map((item) => ({
                                                label: item.name,
                                                value: item._id,
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
                                        Submit
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
    // const session = await getSession(ctx);
    const matpel = await matpelService.get()

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
            matpel: matpel
        },
    };
}

