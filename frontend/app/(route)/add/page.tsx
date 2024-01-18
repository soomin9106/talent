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
        console.log(name);
        
    }
    return (
        <div className="bg-white flex flex-col space-y-[20px] w-full h-[100vh] p-[16px]">
            <div>
                <span className="font-medium text-[24px] text-black">셀 추가하기</span>
            </div>
            <div className="flex flex-col space-y-[10px] w-full">
                <div className="p-[10px] rounded-[8px] text-[16px] text-black font-medium">
                    <Input
                        placeholder="셀이름을 입력하세요"
                        label="셀이름을 입력하세요"
                        crossOrigin={undefined}
                        value={name}
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