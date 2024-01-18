'use client';
import BackButton from "../../public/back.svg"
import { useRouter } from "next/navigation";

const BackTopBar = () => {
    const router = useRouter()
    return (
        <div className="flex w-full h-[20px] bg-white">
            <div className="mr-auto" onClick={() => {
                router.back()
            }}>
                <BackButton />
            </div>
        </div>
    )
}

export default BackTopBar