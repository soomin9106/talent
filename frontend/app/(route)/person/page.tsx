'use client';
import BackTopBar from "@/app/_components/BackTopBar";
import { gradeOptions, zoneOptions } from "@/app/_const/options";
import { addChild } from "@/app/_utils/functions";
import classNames from "classnames"
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react"
import { handleChange } from "../edit/page";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddPerson = () => {
    const params = useSearchParams()
    const router = useRouter()
    const cell_id = Number(params.get('cell_id'))

    const [name, setName] = useState("")
    const [grade, setGrade] = useState("")
    const [zone, setZone] = useState("")
    const [talent, setTalent] = useState(0)

    const onClickPersonAdd = async () => {
        const response = addChild(cell_id, { name, grade, zone, talent })

        if ((await response).status === 200) {
            router.back()
        } else if ((await response).status === 500) {
            alert(`셀원 추가에 실패하였습니다.`)
        }
    }

    const handleGrade = (value: string) => {
        setGrade(value)
    }

    const handleZone = (value: string) => {
        setZone(value)
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-white flex flex-col space-y-[20px] w-full h-[100vh] p-[16px]">
                <BackTopBar />
                <div>
                    <span className="font-medium text-[24px] text-black">인원 추가</span>
                </div>
                <div className="flex flex-col space-y-[10px] w-full">
                    <div className="w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Input
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => {
                                handleChange(e, setName)
                            }}
                            className="peer w-full h-full bg-transparent text-blue-gray-700 font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                        />
                    </div>
                    <div className="flex w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Select onValueChange={handleGrade}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="학년을 고르세요." defaultValue={zone} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="1">1학년</SelectItem>
                                    <SelectItem value="2">2학년</SelectItem>
                                    <SelectItem value="3">3학년</SelectItem>
                                    <SelectItem value="4">4학년</SelectItem>
                                    <SelectItem value="5">5학년</SelectItem>
                                    <SelectItem value="6">6학년</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>


                    </div>
                    <div className="w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Select onValueChange={handleZone}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Zone 을 고르세요." defaultValue={zone} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Green">Green</SelectItem>
                                    <SelectItem value="Gray">Gray</SelectItem>
                                    <SelectItem value="Black">Black</SelectItem>
                                    <SelectItem value="New">New</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Input
                            placeholder="초기 달란트 양을 입력하세요 (입력 안할 시 0 달란트)"
                            value={talent}
                            onChange={(e) => {
                                handleChange(e, setTalent)
                            }}
                            className="peer w-full h-full bg-transparent text-blue-gray-700 font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                        />
                    </div>
                </div>
                <div
                    onClick={onClickPersonAdd}
                    className={classNames(
                        "cursor-pointer px-[28px] py-[10px] rounded-[8px] bg-brown mt-auto flex justify-center",

                    )}
                    style={{ "marginTop": "auto" }}
                >
                    <span className={classNames("font-medium text-[15px] text-white")}>
                        인원 추가하기
                    </span>
                </div>
            </div>
        </Suspense>
    )
}

export default AddPerson