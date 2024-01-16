'use client'
import { Input } from "@material-tailwind/react"
import classNames from "classnames";
import { useState } from "react";

const AddCell = () => {
    const [name, setName] = useState('')

    const handleChange = (event: { target: { value: any; }; }) => {
        setName(event.target.value)
    }

    const onClickCellAdd = () => {
        console.log('셀 추가 API call');
    }
    return (
        <div className="bg-white flex flex-col space-y-[20px] w-full h-[100vh] p-[16px]">
            <div>
                <span className="font-medium text-[24px] text-black">셀 추가하기</span>
            </div>
            <div className="flex flex-col space-y-[10px] w-full">
                <div className="border-[1px] border-lightGray p-[10px] rounded-[8px] text-[16px] text-black font-medium">
                    <Input
                        placeholder="셀 이름을 입력하세요"
                        crossOrigin={undefined}
                        value={name}
                        onChange={handleChange}
                        labelProps={{
                            className: "border-[0px]",
                        }}
                    />
                </div>
            </div>
            <div
                onClick={onClickCellAdd}
                className={classNames(
                    "cursor-pointer px-[28px] py-[10px] rounded-[8px] bg-brown mt-auto flex justify-center",

                )}
            >
                <span className={classNames("font-medium text-[15px] text-white")}>
                    셀 추가하기
                </span>
            </div>
        </div>
    )
}

export default AddCell