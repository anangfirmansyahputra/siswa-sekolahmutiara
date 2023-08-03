import { setUser } from "@/redux/slices/userSlices";
import authService from "@/services/auth.service";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Skeleton, Spin, Typography } from "antd";
import { Head } from "next/document";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function Login() {
    const [form] = Form.useForm();
    const dispatch = useDispatch()

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        localStorage.removeItem('siswa-token')

    }, [])

    const onFinish = async (values) => {
        setIsLoading(true)

        try {
            const res = await authService.login(values)
            localStorage.setItem('siswa-token', res.token)

            Swal.fire({
                title: "Sukses",
                text: "Login berhasil",
                icon: "success"
            }).then(() => router.push('/secure/dashboard'))

            const me = await authService.me({ token: res.token })
            dispatch(setUser(me.data))
        } catch (err) {
            Swal.fire({
                title: "Gagal",
                text: err?.response?.data?.message || "Login gagal, silahkan coba kembali",
                icon: "error"
            })
        } finally {
            setIsLoading(false)
            form.resetFields();
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#f3f3f3] rounded-lg overflow-hidden">
            <div className="bg-white px-5 pb-5 shadow-xl w-[300px]">
                <Spin spinning={isLoading}>
                    <div className="mb-10">
                        <Title
                            className="text-center"
                            level={4}>
                            Sistem Ekstrakurikuler Siswa
                        </Title>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        form={form}
                        style={{
                            width: 300,
                        }}
                        onFinish={onFinish}>
                        <Form.Item
                            name="nis"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your NIS!",
                                },
                            ]}>
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="NIS"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                            ]}>
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                style={{
                                    width: "100%",
                                    marginTop: 10,
                                }}
                                type="primary"
                                htmlType="submit">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="font-sans text-[12px] text-center text-gray-500">Copyright © 2023 Sekolah Mutiara. All Rights Reserved.</p>
                </Spin>
            </div>

        </div>
    );
}

Login.getLayout = function (page) {
    return page
}