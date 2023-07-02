import useCreatePengajarContext from "@/context/useCreatePengajarContext";
import kelasService from "@/services/kelas.service";
import prestasiService from "@/services/prestasi.service";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Spin, Typography, Upload, message } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

Tambah.layout = "L1";

let index = 0;

export default function Tambah({ ekstrakurikuler, siswa, kelas }) {
    const [form] = Form.useForm();
    const { push } = useRouter();

    const [loadingFirst, setLoadingFirst] = useState(true);
    const [img, setImg] = useState(null);
    const [imgSertifikat, setImgSertifikat] = useState(null);
    const [selectKelas, setSelectKelas] = useState(null);
    const [selectKelasName, setSelectKelasName] = useState(null);

    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const onFinish = async (values) => {
        setLoadingFirst(true);

        var formData = new FormData();
        formData.append("images", values.images1.file.originFileObj);
        formData.append("images", values.images2.file.originFileObj);
        formData.append("ekstrakurikuler", values.ekstrakurikuler);
        formData.append("siswa", values.siswa);
        formData.append("kelas", values.kelas);
        formData.append("deskripsi", values.deskripsi);
        formData.append("tgl", values.tgl);

        try {
            const res = await prestasiService.create(formData);
            message.success(res.message);
            push("/prestasi");
        } catch (err) {
            message.success(err.message);
        } finally {
            setLoadingFirst(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    useEffect(() => {
        setLoadingFirst(false);
    }, []);

    const props = {
        name: "images",
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        headers: {
            authorization: "authorization-text",
        },
        onChange(info) {
            if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <>
            <Head>
                <title>Form Prestasi | Sistem Informasi Mutiara</title>
            </Head>
            <div>
                <Typography.Title level={2}>Form Prestasi</Typography.Title>
                <div className="my-[25px] flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: <Link href="/prestasi">Prestasi</Link>,
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
                                <Col span={12}>
                                    <Form.Item
                                        label="Ekstrakurikuler"
                                        name="ekstrakurikuler">
                                        <Select
                                            placeholder="Ekstrakurikuler"
                                            options={ekstrakurikuler?.data?.map((item) => ({
                                                label: item?.name,
                                                value: item?._id,
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Deskripsi Juara"
                                        name="deskripsi">
                                        <Input placeholder="Deskripsi Juara" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Kelas">
                                                <Select
                                                    onChange={(value) => {
                                                        form.setFieldsValue({ kelas: undefined });
                                                        setSelectKelas(value);
                                                    }}
                                                    placeholder="Kelas"
                                                    options={[
                                                        { label: "7", value: "7" },
                                                        { label: "8", value: "8" },
                                                        { label: "9", value: "9" },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Nama Kelas"
                                                name="kelas">
                                                <Select
                                                    onChange={(value) => {
                                                        form.setFieldsValue({ siswa: undefined });
                                                        setSelectKelasName(value);
                                                    }}
                                                    disabled={selectKelas == null}
                                                    placeholder="Nama Kelas"
                                                    options={kelas?.data
                                                        ?.filter((item) => item?.kelas == selectKelas)
                                                        ?.map((item) => ({
                                                            label: item?.name,
                                                            value: item?._id,
                                                        }))}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Siswa"
                                        name="siswa">
                                        <Select
                                            showSearch
                                            disabled={selectKelasName == null}
                                            placeholder="Siswa"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? "").includes(input)}
                                            filterSort={(optionA, optionB) => (optionA?.label.toLocaleLowerCase() ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                                            options={siswa?.data
                                                ?.filter((item) => item?.kelas?._id == selectKelasName)
                                                ?.map((item) => ({
                                                    label: item?.name,
                                                    value: item?._id,
                                                }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tanggal"
                                        name="tgl">
                                        <DatePicker
                                            style={{
                                                width: "100%",
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Upload Img"
                                        name="images1">
                                        <Upload
                                            onChange={(values) => setImg(values)}
                                            // {...props}
                                            maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="images2"
                                        label="Upload Sertifikat">
                                        <Upload
                                            onChange={(values) => setImgSertifikat(values)}
                                            // {...props}
                                            maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
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
                                        onClick={() => push("/prestasi")}
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
