"use client"

import CellInfo from "@/app/_components/CellInfo";
import { cellInfoMock } from "@/app/_const/mock";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Input } from "@material-tailwind/react";
import Check from "../../../public/check.svg"
import Cancle from "../../../public/cancle.svg"
import BackTopBar from "@/app/_components/BackTopBar";
import { IStudentInfo, PerCell } from "@/app/_const/interfaces";
import { useQuery } from "@tanstack/react-query";
import { editCell, getCellsById, getChild } from "@/app/_utils/functions";

const CellDetail = () => {
    const params = useSearchParams();
    const id = Number(params.get('id'))
    const router = useRouter()

    // 셀 관련 정보 읽기
    const { data, refetch } = useQuery<PerCell>({
        queryKey: [`cell-${id}`],
        queryFn: () => getCellsById({ cell_id: id }),
        staleTime: 5 * 1000,
    });

    const [cellName, setCellName] = useState(data?.name)
    const [isEditable, setIsEditable] = useState(false)

    const changeToEditMode = () => {
        setIsEditable(true)
    }

    const cancelEditMode = () => {
        setCellName(data?.name)
        setIsEditable(false)
    }

    const handleChange = (event: { target: { value: any; }; }) => {
        setCellName(event.target.value)
    }

    const handleCellNameSubmit = async () => {
        //API call (이름 변경)
        const response = editCell({ id, name: cellName ? cellName : "" })

        if ((await response).status === 200) {
            setIsEditable(false)
            refetch()
        } else {
            setCellName(data?.name)
            setIsEditable(false)
        }
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col bg-white w-full h-[100vh] px-[16px] pt-[16px] space-y-[25px]">
                <BackTopBar />
                <div className="flex flex-col space-y-[12px]">
                    <div className="flex flex-row">
                        <div>
                            {
                                isEditable ? (
                                    <div className="flex flex-row w-full">
                                        <div className="">
                                            {/* <Input variant="static" value={cellName} defaultValue={cellName} placeholder="셀이름" crossOrigin={undefined} onChange={handleChange} containerProps={{
                                                className: "text-[24px] text-black font-bold",
                                            }} /> */}
                                            <Input
                                                placeholder="셀명"
                                                label="셀명"
                                                crossOrigin={undefined}
                                                value={cellName}
                                                onChange={(e) => {
                                                    handleChange(e)
                                                }}
                                                labelProps={{
                                                    className: "",
                                                }}
                                                className="peer w-full h-full bg-transparent text-blue-gray-700 font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                                            />
                                        </div>
                                    </div>

                                ) : (
                                    <span className="text-[24px] text-black font-bold">{data?.name}</span>
                                )
                            }
                        </div>
                        <>
                            {
                                isEditable ? (
                                    <div className="flex space-x-[4px] ml-auto">
                                        <div className="flex px-[6px] py-[2px] rounded-[8px] bg-brown items-center justify-center" onClick={handleCellNameSubmit}>
                                            <span className="text-[12px] font-medium text-white">
                                                완료
                                            </span>
                                        </div>
                                        <div className="flex px-[6px] py-[2px] rounded-[8px] bg-brown items-center justify-center" onClick={cancelEditMode}>
                                            <span className="text-[12px] font-medium text-white">
                                                취소
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ml-auto flex px-[6px] py-[2px] rounded-[8px] bg-brown items-center justify-center" onClick={changeToEditMode}>
                                        <span className="text-[12px] font-medium text-white">
                                            수정
                                        </span>
                                    </div>
                                )
                            }
                        </>
                    </div>
                    <div className="flex">
                        <div className="flex space-x-[4px] justify-center items-center">
                            <span className="text-[20px] text-naturalGray font-medium">총 인원</span>
                            <div className="px-[6px] py-[2px] rounded-[8px] bg-brown">
                                <span className="text-[14px] text-white font-medium">{data?.children_count}명</span>
                            </div>
                        </div>
                    </div>
                </div>
                <CellInfo activeCellId={id} />
                <div className="flex flex-row space-x-[4px] w-full">
                    <div
                        onClick={() => {
                            router.push(`/person?cell_id=${id}`)
                        }}
                        className={classNames(
                            "cursor-pointer px-[28px] py-[12px] rounded-[8px] bg-brown mt-auto",

                        )}
                    >
                        <span className={classNames("font-medium text-[15px] text-white")}>
                            인원 추가
                        </span>
                    </div>
                    <div
                        onClick={() => {
                            console.log('보고서 작성');
                        }}
                        className={classNames(
                            "cursor-pointer px-[28px] py-[12px] rounded-[8px] bg-brown mt-auto",

                        )}
                    >
                        <span className={classNames("font-medium text-[15px] text-white")}>
                            보고서 작성
                        </span>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default CellDetail