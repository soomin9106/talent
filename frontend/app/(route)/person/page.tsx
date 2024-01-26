'use client';
import BackTopBar from "@/app/_components/BackTopBar";
import { gradeOptions, zoneOptions } from "@/app/_const/options";
import { addChild, handleChange } from "@/app/_utils/functions";
import { Input, Select, Option } from "@material-tailwind/react"
import classNames from "classnames"
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react"

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
        }
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
                            label="이름을 입력하세요"
                            crossOrigin={undefined}
                            value={name}
                            onChange={(e) => {
                                handleChange(e, setName)
                            }}
                            labelProps={{
                                className: "",
                            }}
                            className="peer w-full h-full bg-transparent text-blue-gray-700 font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                        />
                    </div>
                    <div className="flex w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Select selected={
                            (element) => {
                                setGrade(element?.props?.value)
                                return element?.props?.value
                            }
                        } color="blue" value={grade} label="학년을 선택하세요" className="flex border-[1px] rounded-[8px] text-black" placeholder={"학년을 선택하세요"}>
                            {
                                gradeOptions.map((option) => {
                                    return (
                                        <Option key={option.value} className="text-black" id={option.value} value={option.value}>{option.label}</Option>
                                    )
                                })
                            }
                        </Select>


                    </div>
                    <div className="w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Select selected={
                            (element) => {
                                setZone(element?.props?.value)
                                return element?.props?.value
                            }
                        } color="blue" value={zone} label="zone을 선택하세요" className="flex border-[1px] rounded-[8px] text-black" placeholder={"zone을 선택하세요"}>
                            {
                                zoneOptions.map((option) => {
                                    return (
                                        <Option key={option.value} className="text-black" id={option.value} value={option.value}>{option.label}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className="w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                        <Input
                            placeholder="초기 달란트 양을 입력하세요 (입력 안할 시 0 달란트)"
                            label="초기 달란트 양을 입력하세요 (입력 안할 시 0 달란트)"
                            crossOrigin={undefined}
                            value={talent}
                            onChange={(e) => {
                                handleChange(e, setTalent)
                            }}
                            labelProps={{
                                className: "",
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