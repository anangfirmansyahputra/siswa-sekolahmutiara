import { RollbackOutlined } from "@ant-design/icons"
import { Breadcrumb, Button, Card, Descriptions, Layout, Typography } from "antd"
import Head from "next/head"
import Link from "next/link"

NilaiPage.layout = "L1"
const { Content } = Layout
const { Title } = Typography

export default function NilaiPage() {
    return (
        <>
            <Head>
                <title>Nilai | Sistem Informasi Mutiara</title>
            </Head>
            <Content style={{ margin: "0 16px" }}>
                <div className="flex justify-between items-center">
                    <div>
                        <Title
                            level={3}
                            style={{ marginBottom: "0" }}>
                            Mata Pelajaran
                        </Title>
                        <Breadcrumb style={{ margin: "0 0 16px" }} items={[
                            {
                                title: <Link href={{
                                    pathname: "/dashboard"
                                }}>Dashboard</Link>
                            },
                            {
                                title: "Nilai"
                            }
                        ]} />
                    </div>
                </div>

                <Card>
                    <Descriptions title="Info Siswa" bordered column={2}>
                        <Descriptions.Item label="Nama" span={3}>ASDASDASDAS</Descriptions.Item>
                        <Descriptions.Item label="NIS"></Descriptions.Item>

                        <Descriptions.Item label="Alamat"></Descriptions.Item>
                        <Descriptions.Item label="Tanggal Lahir"></Descriptions.Item>
                        <Descriptions.Item label="Kelas"></Descriptions.Item>
                        <Descriptions.Item label="Ekstrakurikuler Pilihan"></Descriptions.Item>
                        <Descriptions.Item label="Ekstrakurikuler Wajib"></Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Pilihan"></Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Pilihan">
                        </Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Wajib"></Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Wajib">
                        </Descriptions.Item>
                    </Descriptions>

                    <div className="mt-5">
                        <Button type="primary" icon={<RollbackOutlined />}>Kembali</Button>
                    </div>
                </Card>
            </Content>
        </>
    )
}