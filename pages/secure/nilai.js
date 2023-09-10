import { selecUser } from "@/redux/slices/userSlices";
import { Alert, Breadcrumb, Button, Card, Descriptions, Space, Table, Tabs, Typography } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import http from '@/plugin/https'
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export default function NilaiPage() {
    const router = useRouter()
    const [data, setData] = useState(null)
    // let columnsWajib = [];

    const totalNilai = (akademik, data) => {
        const nilaiAkademik = (akademik * 70 / 100)
        // const nilaiAbsen = ((absen / 14) * 100) * 40 / 100
        const totalTrue = data?.filter((item) => item === true).length;

        // Menghitung total panjang array
        const totalLength = data?.length;

        // Menghitung persentase nilai true

        const nilaiAbsen = Math.ceil(((totalTrue / totalLength) * 100) * 30 / 100);

        const nilaiTotal = nilaiAbsen + nilaiAkademik

        if (nilaiTotal > 85) {
            return `${nilaiTotal} | A`
        } else if (nilaiTotal >= 75 && nilaiTotal < 86) {
            return `${nilaiTotal} | B`
        } else {
            return `${nilaiTotal} | C`
        }
    }

    // for (let i = 0; i < 14; i++) {
    //     columnsWajib.push({
    //         title: `Pertemuan ${i + 1}`,
    //         dataIndex: `pertemuan${i + 1}`,
    //         key: `pertemuan${i + 1}`,
    //         render: (_, record) => (
    //             <span>{record[`pertemuan${i + 1}`] ? <CheckOutlined style={{
    //                 color: "green"
    //             }} /> : <CloseOutlined style={{
    //                 color: "red"
    //             }} />}</span>
    //         ),
    //     })
    // }

    const columnsWajib = [
        {
            title: "I",
            dataIndex: `pertemuan1`,
            key: `pertemuan1`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan1'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan1'] ? "H" : "X"}</span>
            )
        },
        {
            title: "II",
            dataIndex: `pertemuan2`,
            key: `pertemuan2`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan2'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan2'] ? "H" : "X"}</span>
            )
        },
        {
            title: "III",
            dataIndex: `pertemuan3`,
            key: `pertemuan3`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan3'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan3'] ? "H" : "X"}</span>
            )
        },
        {
            title: "IV",
            dataIndex: `pertemuan4`,
            key: `pertemuan4`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan4'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan4'] ? "H" : "X"}</span>
            )
        },
        {
            title: "V",
            dataIndex: `pertemuan5`,
            key: `pertemuan5`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan5'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan5'] ? "H" : "X"}</span>
            )
        },
        {
            title: "VI",
            dataIndex: `pertemuan6`,
            key: `pertemuan6`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan6'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan6'] ? "H" : "X"}</span>
            )
        },
        {
            title: "VII",
            dataIndex: `pertemuan7`,
            key: `pertemuan7`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan7'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan7'] ? "H" : "X"}</span>
            )
        },
        {
            title: "VIII",
            dataIndex: `pertemuan8`,
            key: `pertemuan8`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan8'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan8'] ? "H" : "X"}</span>
            )
        },
        {
            title: "IX",
            dataIndex: `pertemuan9`,
            key: `pertemuan9`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan9'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan9'] ? "H" : "X"}</span>
            )
        },
        {
            title: "X",
            dataIndex: `pertemuan10`,
            key: `pertemuan10`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan10'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan10'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XI",
            dataIndex: `pertemuan11`,
            key: `pertemuan11`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan11'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan11'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XII",
            dataIndex: `pertemuan12`,
            key: `pertemuan12`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan12'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan12'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XIII",
            dataIndex: `pertemuan13`,
            key: `pertemuan13`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan13'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan13'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XIV",
            dataIndex: `pertemuan14`,
            key: `pertemuan14`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan14'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan14'] ? "H" : "X"}</span>
            )
        },
    ]

    const getKehadiran = (array) => {
        let value = []

        value.push({
            key: 1,
            pertemuan1: array?.kehadiran?.[0],
            pertemuan2: array?.kehadiran?.[1],
            pertemuan3: array?.kehadiran?.[2],
            pertemuan4: array?.kehadiran?.[3],
            pertemuan5: array?.kehadiran?.[4],
            pertemuan6: array?.kehadiran?.[5],
            pertemuan7: array?.kehadiran?.[6],
            pertemuan8: array?.kehadiran?.[7],
            pertemuan9: array?.kehadiran?.[8],
            pertemuan10: array?.kehadiran?.[9],
            pertemuan11: array?.kehadiran?.[10],
            pertemuan12: array?.kehadiran?.[11],
            pertemuan13: array?.kehadiran?.[12],
            pertemuan14: array?.kehadiran?.[13],
        })

        return value
    }

    const user = useSelector(selecUser)
    const pilihan = data?.data?.nilai?.ekstrakurikulerPilihan
    const wajib = data?.data?.nilai?.ekstrakurikulerWajib

    useEffect(() => {
        const fetchData = async () => {
            const res = await http.get(`/siswa/${user?._id}`)

            setData(res.data)
        }

        if (user?._id) {
            fetchData()
        }

    }, [user?._id])

    const items = [
        {
            key: '2',
            label: `Ekstrakurikuler Pilihan`,
            children: <Table scroll={{
                x: "auto"
            }} dataSource={pilihan?.ekstrakurikuler !== null ? getKehadiran(pilihan) : []} pagination={false} columns={pilihan?.ekstrakurikuler !== null ? columnsWajib : []} />,
        },
        {
            key: '1',
            label: `Ekstrakurikuler Wajib`,
            children: <Table scroll={{
                x: "auto"
            }} dataSource={wajib?.ekstrakurikuler !== null ? getKehadiran(wajib) : []} pagination={false} columns={wajib?.ekstrakurikuler !== null ? columnsWajib : []} />,
        },
    ]

    const nilaiAbsen = (data) => {

        const totalTrue = data?.filter((item) => item === true).length;

        // Menghitung total panjang array
        const totalLength = data?.length;

        // Menghitung persentase nilai true
        const percentageTrue = Math.ceil((totalTrue / totalLength) * 100);

        return percentageTrue
    }

    return (
        <>
            <Head>
                <title>Nilai | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <div className="pb-10">
                <Typography.Title level={2}>Nilai</Typography.Title>
                <Breadcrumb items={[
                    {
                        title: <Link href={{ pathname: "/secure/dashboard" }}>Dashboard</Link>
                    },
                    {
                        title: "Nilai"
                    }
                ]} />

                {/* {wajib?.ekstrakurikuler === null && (
                    <Alert
                        message="Peringatan"
                        showIcon
                        style={{ marginTop: 20 }}
                        description="Mohon untuk memilih ekstrakurikuler wajib dan pilihan agar mendapatkan nilai untuk kenaikan kelas!"
                        type="error"
                        action={
                            <Button size="small" danger onClick={() => router.push('/secure/ekstrakurikuler')}>
                                Gabung Ekstrakurikuler
                            </Button>
                        }
                    />
                )} */}
                {user !== null && (
                    <Card className="mt-5">
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Descriptions className="flex-1" column={1} bordered title="Ekstrakurikuler Pilihan">
                                {pilihan?.ekstrakurikuler !== null ? (
                                    <>
                                        <Descriptions.Item label="Nama">
                                            {pilihan?.ekstrakurikuler?.name}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nilai Absen">
                                            {/* {pilihan?.absen} */}
                                            {nilaiAbsen(pilihan?.kehadiran)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nilai Akademik">
                                            {pilihan?.nilai}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nilai Total">
                                            {/* {totalNilai(pilihan?.nilai, pilihan?.absen)} */}
                                            {totalNilai(pilihan?.nilai, pilihan?.kehadiran)}
                                        </Descriptions.Item>
                                    </>
                                ) : <Button>Belum Terdaftar</Button>}

                            </Descriptions>
                            <Descriptions className="flex-1" bordered title="Ekstrakurikuler Wajib" column={1}>
                                {wajib?.ekstrakurikuler !== null ? (
                                    <>
                                        <Descriptions.Item label="Nama">
                                            {wajib?.ekstrakurikuler?.name}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nilai Absen">
                                            {/* {wajib?.absen} */}
                                            {nilaiAbsen(wajib?.kehadiran)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nilai Akademik">
                                            {wajib?.nilai}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nilai Total">
                                            {/* {totalNilai(wajib?.nilai, wajib?.absen)} */}
                                            {totalNilai(wajib?.nilai, wajib?.kehadiran)}
                                        </Descriptions.Item>
                                    </>
                                ) : <Button>Belum Terdaftar</Button>}
                            </Descriptions>
                        </div>
                    </Card>

                )}
                <Card style={{ marginTop: '1rem' }}>
                    <Tabs items={items} />
                </Card>
            </div >
        </>
    )
}
