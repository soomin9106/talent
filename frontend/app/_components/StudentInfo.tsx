import classNames from "classnames"
import { StudentInfoProps } from "../_const/interfaces"

const StudentInfo = (props: StudentInfoProps) => {
    const { name, grade, zone, talent } = props
    const zoneColor = zone === "Green" ? "bg-green" : zone === "Gray" ? "bg-lightGray" : zone === "New" ? "bg-yellow" : "bg-black"
    return (
        <div className="w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] space-x-[42px] items-center">
            <div>
                <span className="text-black text-[16px] font-medium">{name}</span>
            </div>
            <div className="border rounded-[10px]">
                <span className="text-black text-[16px] font-medium">{grade}학년</span>
            </div>
            <div className="flex flex-col space-y-[4px]">
                <span className="text-black text-[16px] font-medium">{zone}</span>
                <div className={classNames(
                    "w-[40px] h-[8px]",
                    `${zoneColor}`
                )}></div>
            </div>
            <div>
                <span className="text-black text-[16px] font-medium">{talent}</span>
            </div>
            <div
                onClick={() => {
                    console.log('수정하기');
                }}
                className={classNames(
                    "cursor-pointer px-[12px] py-[10px] rounded-[8px] bg-brown mt-auto",

                )}
            >
                <span className={classNames("font-medium text-[15px] text-white")}>
                    수정
                </span>
            </div>
        </div>
    )
}

export default StudentInfo