'use client';
import classNames from "classnames"
import { StudentInfoProps } from "../_const/interfaces"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const StudentInfo = (props: StudentInfoProps) => {
    const params = useSearchParams();
    const router = useRouter()
    const cellId = Number(params.get('id'))
    const { id: studentId, name, grade, zone, talent } = props
    const zoneColor = zone === "Green" ? "bg-green" : zone === "Gray" ? "bg-lightGray" : zone === "New" ? "bg-yellow" : "bg-black"
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] space-x-[42px] items-center">
                <div>
                    <span className="text-black text-[14px] font-medium whitespace-nowrap">{name}</span>
                </div>
                <div className="border p-[4px] rounded-[10px]">
                    <span className="text-black text-[14px] font-medium whitespace-nowrap">{grade}</span>
                </div>
                <div className="flex flex-col space-y-[4px]">
                    <span className="text-black text-[14px] font-medium">{zone}</span>
                    <div className={classNames(
                        "w-[40px] h-[8px]",
                        `${zoneColor}`
                    )}></div>
                </div>
                <div>
                    <span className="text-black text-[14px] font-medium">{talent}</span>
                </div>
                <div
                    onClick={() => {
                        router.push(`/edit?studentId=${studentId}&cellId=${cellId}`)
                    }}
                    className={classNames(
                        "cursor-pointer p-[8px] rounded-[8px] bg-brown mt-auto",

                    )}
                >
                    <span className={classNames("font-medium text-[14px] text-white whitespace-nowrap")}>
                        수정
                    </span>
                </div>
            </div>
        </Suspense>
    )
}

export default StudentInfo