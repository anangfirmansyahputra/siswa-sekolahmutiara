import siswaService from "@/services/siswa.service"
import { RollbackOutlined } from "@ant-design/icons"
import { Badge, Breadcrumb, Button, Card, Descriptions, Layout, Typography } from "antd"
import dayjs from "dayjs"
import { getSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

NilaiPage.layout = "L1"
const { Content } = Layout
const { Title } = Typography

export default function NilaiPage({ getSiswa }) {
    const { push } = useRouter()

    const [siswa, setSiswa] = useState(getSiswa?.data)

    const trueCount = siswa?.nilai?.ekstrakurikulerPilihan?.kehadiran?.filter(item => item === true)?.length;
    const falseCount = siswa?.nilai?.ekstrakurikulerPilihan?.kehadiran?.filter(item => item === false)?.length;
    const total = trueCount + falseCount;

    const trueCountW = siswa?.nilai?.ekstrakurikulerWajib?.kehadiran?.filter(item => item === true)?.length;
    const falseCountW = siswa?.nilai?.ekstrakurikulerWajib?.kehadiran?.filter(item => item === false)?.length;
    const totalW = trueCount + falseCount;

    return (
        <>
            <Head>
                <title>Mata Pelajaran | Sistem Informasi Mutiara</title>
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
                                title: "Mata Pelajaran"
                            }
                        ]} />
                    </div>
                </div>

                <Card>
                    <Descriptions title="Info Siswa" bordered column={2}>
                        <Descriptions.Item label="Nama" span={3}>{siswa?.name}</Descriptions.Item>
                        <Descriptions.Item label="NIS">{siswa?.nis}</Descriptions.Item>

                        <Descriptions.Item label="Alamat">{siswa?.alamat}</Descriptions.Item>
                        <Descriptions.Item label="Tanggal Lahir">{dayjs(siswa?.tgl).format('YYYY-MM-DD')}</Descriptions.Item>
                        <Descriptions.Item label="Kelas">{siswa?.kelas?.kelas + " " + siswa?.kelas?.name}</Descriptions.Item>
                        <Descriptions.Item label="Ekstrakurikuler Pilihan">{siswa?.nilai?.ekstrakurikulerPilihan?.ekstrakurikuler?.name}</Descriptions.Item>
                        <Descriptions.Item label="Ekstrakurikuler Wajib">{siswa?.nilai?.ekstrakurikulerWajib?.ekstrakurikuler?.name ?? "Belum memilih"}</Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Pilihan">{siswa?.nilai?.ekstrakurikulerPilihan?.nilai}</Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Pilihan">
                            {`${trueCount}/${total}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Wajib">{siswa?.nilai?.ekstrakurikulerWajib?.nilai}</Descriptions.Item>
                        <Descriptions.Item label="Nilai Ekstrakurikuler Wajib">
                            {`${trueCountW}/${totalW}`}
                        </Descriptions.Item>
                    </Descriptions>

                    <div className="mt-5">
                        <Button type="primary" icon={<RollbackOutlined />} onClick={() => push('/siswa')}>Kembali</Button>
                    </div>
                </Card>

            </Content>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    const id = ctx.params.id
    const siswa = await siswaService.getById(id)

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
            props: {},
        };
    }
    return {
        props: {
            getSiswa: siswa
        },
    };
}
