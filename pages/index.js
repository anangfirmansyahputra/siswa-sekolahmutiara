import { useRouter } from "next/router"

export default function Page() {
    const router = useRouter()

    router.push('/secure/dashboard')

    return (
        <div></div>
    )
}
