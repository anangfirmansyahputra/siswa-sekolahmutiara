import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import Link from "next/link";

export default function AddDelete({ link, text }) {
    return (
        <Space>
            <Link
                href={{
                    pathname: link,
                }}>
                <Button
                    type="default"
                    icon={<DeleteOutlined />}
                    size="middle">
                    {text}
                </Button>
            </Link>
            <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                size="middle"></Button>
        </Space>
    );
}
