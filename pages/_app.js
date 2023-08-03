import LayoutComp from "@/components/LayoutComp";
import "@/styles/globals.css";
import { ConfigProvider, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => (<LayoutComp>{page}</LayoutComp>));

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true);
        };

        const handleComplete = () => {
            setIsLoading(false);
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#008846",
                    fontSize: 12,
                },
            }}>
            <Provider store={store}>
                <Spin
                    spinning={isLoading}
                    style={{
                        maxHeight: "100vh",
                    }}>

                    {getLayout(
                        <>
                            <Component {...pageProps} />
                        </>
                    )}
                </Spin>
            </Provider>
        </ConfigProvider>
    );
}
