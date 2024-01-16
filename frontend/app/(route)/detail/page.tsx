"use client"

import CellInfo from "@/app/_components/CellInfo";
import { cellInfoMock } from "@/app/_const/mock";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@material-tailwind/react";
import Check from "../../../public/check.svg"
import Cancle from "../../../public/cancle.svg"

const CellDetail = () => {
    const params = useSearchParams();
    const id = Number(params.get('id'))

    //Filter from mock data - about specific cell
    const data = cellInfoMock.find((cell: CellInfo) => {
        if (cell.id === id) {
            return cell
        }
    })

    const [cellName, setCellName] = useState(data?.name)
    const [isEditable, setIsEditable] = useState(false)

    const changeToEditMode = () => {
        setIsEditable(true)
    }

    const handleChange = (event: { target: { value: any; }; }) => {
        setCellName(event.target.value)
    }

    const handleCellNameSubmit = () => {
        //API call (이름 변경)
        setIsEditable(false)
    }

    const handleCancleNameChange = () => {
        setIsEditable(false)
        setCellName(data?.name)
    }

    return (
        <div className="flex flex-col bg-white w-full h-[100vh] px-[16px] pt-[16px] space-y-[25px]">
            <div className="flex flex-col space-y-[12px]">
                <div onClick={() => {
                    changeToEditMode()
                }}>
                    {
                        isEditable ? (
                            <div className="flex flex-row w-full">
                                <div className="border-[1px] border-lightGray p-[8px] rounded-[8px]">
                                    <Input variant="static" value={cellName} placeholder="셀이름" crossOrigin={undefined} onChange={handleChange} containerProps={{
                                        className: "text-[24px] text-black font-bold",
                                    }} />
                                </div>
                                <div className="ml-auto flex">
                                    <div onClick={handleCellNameSubmit}>
                                        <Check />
                                    </div>
                                    <div onClick={handleCancleNameChange}>
                                        <Cancle />
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <span className="text-[24px] text-black font-bold">{data?.name}</span>
                        )
                    }
                </div>
                <div className="flex">
                    <div className="flex space-x-[4px] justify-center items-center">
                        <span className="text-[20px] text-naturalGray font-medium">총 인원</span>
                        <div className="px-[6px] py-[2px] rounded-[8px] bg-brown">
                            <span className="text-[14px] text-white font-medium">{data?.student_info?.length}명</span>
                        </div>
                    </div>
                </div>
            </div>
            <CellInfo activeCellId={id} />
            <div className="flex flex-row space-x-[4px] w-full">
                <div
                    onClick={() => {
                        console.log('셀 인원 추가');
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
                        console.log('셀 인원 추가');
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
    )
}

export default CellDetail