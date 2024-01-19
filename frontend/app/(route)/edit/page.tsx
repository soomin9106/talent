'use client'
import BackTopBar from "@/app/_components/BackTopBar"
import { cellInfoMock } from "@/app/_const/mock"
import { gradeOptions, zoneOptions } from "@/app/_const/options"
import { handleChange } from "@/app/_utils/functions"
import { Input, Select, Option } from "@material-tailwind/react"
import classNames from "classnames"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const EditStudentInfo = () => {
    const params = useSearchParams();
    const studentId = Number(params.get('studentId'))
    const cellId = Number(params.get('cellId'))
    const router = useRouter()

    const cell = cellInfoMock.find((cell) => {
        return cell.id === Number(cellId)
    })

    const student = cell?.student_info.find((s) => {
        return s.id === Number(studentId)
    })

    const [name, setName] = useState<string | undefined>(student?.name)
    const [grade, setGrade] = useState<string | undefined>(String(student?.grade))
    const [zone, setZone] = useState<string | undefined>(student?.zone)

    const [wordTalent, setWordTalent] = useState()
    const [prayTalent, setPrayTalent] = useState()

    const onClickPersonEdit = () => {
        console.log('정보 수정');
        console.log(name);
        console.log(grade);
        console.log(zone);
        
    }

    return (
        <div className="bg-white flex flex-col space-y-[20px] w-full h-[100vh] p-[16px]">
            <BackTopBar />
            <div>
                <span className="font-medium text-[24px] text-black">정보 수정</span>
            </div>
            <div className="flex flex-col space-y-[10px] w-full">
                <div className="w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                    <Input
                        placeholder="이름을 입력하세요"
                        label="이름을 입력하세요"
                        crossOrigin={undefined}
                        defaultValue={name}
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
                                    <Option key={option.id} className="text-black" id={option.value} value={option.value}>{option.label}</Option>
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
                <div>
                    <span className="font-medium text-[24px] text-black">달란트 추가</span>
                </div>
                <div className="flex space-x-[4px] w-full py-[10px] rounded-[8px] text-[16px] text-black font-medium">
                    <Input
                        placeholder="말씀 달란트 개수"
                        label="말씀 달란트 개수"
                        crossOrigin={undefined}
                        defaultValue={wordTalent}
                        onChange={(e) => {
                            handleChange(e, setWordTalent)
                        }}
                        labelProps={{
                            className: "",
                        }}
                        className="peer w-full h-full bg-transparent text-blue-gray-700 font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    />
                    <Input
                        placeholder="기도 달란트 개수"
                        label="기도 달란트 개수"
                        crossOrigin={undefined}
                        defaultValue={prayTalent}
                        onChange={(e) => {
                            handleChange(e, setPrayTalent)
                        }}
                        labelProps={{
                            className: "",
                        }}
                        className="peer w-full h-full bg-transparent text-blue-gray-700 font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    />
                </div>
            </div>
            <div
                onClick={onClickPersonEdit}
                className={classNames(
                    "cursor-pointer px-[28px] py-[10px] rounded-[8px] bg-brown mt-auto flex justify-center",

                )}
            >
                <span className={classNames("font-medium text-[15px] text-white")}>
                    수정 완료하기
                </span>
            </div>
        </div>
    )
}

export default EditStudentInfo