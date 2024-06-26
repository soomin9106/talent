import { act } from "react-dom/test-utils"
import { CellInfoProps,  StudentInfoProps } from "../_const/interfaces"
import StudentInfo from "./StudentInfo"
import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { getChildren } from "../_utils/functions"
import { useSearchParams } from "next/navigation"

const CellInfo = ({ activeCellId }: CellInfoProps) => {
    const params = useSearchParams();
    const id = Number(params.get('id'))

    const { data } = useQuery<StudentInfoProps[]>({
        queryKey: [`children-list-${activeCellId}`],
        queryFn: () => getChildren({ cell_id: id }),
        staleTime: 0,
    });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full flex flex-col space-y-[12px]">
                <div className="w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] space-x-[42px] items-center">
                    <div>
                        <span className="text-black text-[14px] font-medium">이름</span>
                    </div>
                    <div className="border rounded-[10px] p-[4px]">
                        <span className="text-black text-[14px] font-medium">학년</span>
                    </div>
                    <div className="flex flex-col space-y-[4px]">
                        <span className="text-black text-[14px] font-medium">zone</span>
                    </div>
                    <div>
                        <span className="text-black text-[14px] font-medium">달란트</span>
                    </div>
                </div>
                {
                    activeCellId ? (
                        <>
                            {
                                data?.map((student) => {
                                    return (
                                        <StudentInfo key={student.name} id={student.id} name={student.name} grade={student.grade} zone={student.zone} talent={student.talent} cellId={student.cellId}/>
                                    )
                                })
                            }
                        </>
                    ) : (
                        <></>
                    )
                }
            </div>
        </Suspense>
    )
}

export default CellInfo