import { useSession } from "next-auth/react";

Page.layout = "L1";

export default function Page() {
    const { data: session } = useSession();

    console.log(session);

    return <div>Page</div>;
}
