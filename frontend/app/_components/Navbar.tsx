"use client"

import { NavbarProps } from "../_const/interfaces"
import classNames from "classnames";
import { useRouter } from "next/navigation";


const Navbar = ({ cellList, activeCellId, setActiveCellId }: NavbarProps) => {
    const router = useRouter()

    const onClickCellAdd = () => {
        router.push('/add')
    }

    const goToCellDetail = (id: number) => {
        router.push(`/detail/?id=${id}`);
    };
    return (
        <div className="flex flex-col w-full h-[100vh] bg-white">
            <nav className="flex flex-col items-center space-y-[48px] h-full">
                <div className="mt-[20px]">
                    <span className="font-bold text-[20px] text-black">예명 아동부</span>
                </div>
                <div className="flex flex-col items-center space-y-[15px]">
                    {cellList.map((value, index) => (
                        <div
                            key={index}
                            className={classNames(
                                "cursor-pointer px-[28px] py-[10px] rounded-[8px]",
                                activeCellId === value.id && "bg-brown"
                            )}
                            onClick={() => {
                                setActiveCellId(value.id);
                                goToCellDetail(value.id)
                            }}
                        >
                            <span className={classNames("font-medium text-[15px]", activeCellId === value.id ? "text-white" : "text-lightGray")}>
                                {value.name}
                            </span>
                        </div>
                    ))}
                </div>
            </nav>
            <div className="p-12">
                <div
                    onClick={onClickCellAdd}
                    className={classNames(
                        "cursor-pointer px-[28px] py-[10px] rounded-[8px] bg-brown mt-auto",

                    )}
                >
                    <span className={classNames("font-medium text-[15px] text-white")}>
                        셀 추가하기
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Navbar