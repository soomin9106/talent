import { act } from "react-dom/test-utils"
import { CellInfo, CellInfoProps } from "../_const/interfaces"
import StudentInfo from "./StudentInfo"
import { cellInfoMock } from "../_const/mock"
import classNames from "classnames"

const CellInfo = ({ activeCellId }: CellInfoProps) => {

    //Filter from mock data - about specific cell
    const data = cellInfoMock.find((cell: CellInfo) => {
        if (cell.id === activeCellId) {
            return cell
        }
    })

    return (
        <div className="w-full flex flex-col space-y-[12px]">
            <div className="w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] space-x-[42px] items-center">
                <div>
                    <span className="text-black text-[16px] font-medium">이름</span>
                </div>
                <div className="border rounded-[10px]">
                    <span className="text-black text-[16px] font-medium">학년</span>
                </div>
                <div className="flex flex-col space-y-[4px]">
                    <span className="text-black text-[16px] font-medium">zone</span>
                </div>
                <div>
                    <span className="text-black text-[16px] font-medium">달란트</span>
                </div>
            </div>
            {
                activeCellId ? (
                    <>
                        {
                            data?.student_info?.map((student) => {
                                return (
                                    <StudentInfo key={student.name} name={student.name} grade={student.grade} zone={student.zone} talent={student.talent} />
                                )
                            })
                        }
                    </>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default CellInfo