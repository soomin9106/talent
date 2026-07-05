'use client';
import BackTopBar from "@/app/_components/BackTopBar";
import { AttendanceCell } from "@/app/_const/interfaces";
import { getAttendanceSheet, setAttendance } from "@/app/_utils/functions";
import classNames from "classnames";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const getRecentSunday = (base: Date = new Date()) => {
    const d = new Date(base);
    d.setDate(d.getDate() - d.getDay());
    return d;
};

const toDateInputValue = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const zoneColor = (zone: string) =>
    zone === "Green" ? "bg-green" : zone === "Gray" ? "bg-lightGray" : zone === "New" ? "bg-yellow" : "bg-black";

const Attendance = () => {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(toDateInputValue(getRecentSunday()));

    const { data } = useQuery<AttendanceCell[]>({
        queryKey: ["attendance-sheet", date],
        queryFn: () => getAttendanceSheet(date),
        staleTime: 0,
    });

    const shiftWeek = (offset: number) => {
        const current = new Date(`${date}T00:00:00`);
        current.setDate(current.getDate() + offset * 7);
        setDate(toDateInputValue(current));
    };

    const onToggle = async (cellId: number, childId: number, present: boolean) => {
        queryClient.setQueryData<AttendanceCell[]>(["attendance-sheet", date], (prev) =>
            prev?.map((cell) =>
                cell.id === cellId
                    ? {
                        ...cell,
                        children: cell.children.map((child) =>
                            child.id === childId ? { ...child, present } : child
                        ),
                    }
                    : cell
            )
        );

        const response = await setAttendance({ child_id: childId, date, present });

        if (response.status !== 200) {
            alert("출석 정보 저장에 실패하였습니다.");
            queryClient.invalidateQueries({ queryKey: ["attendance-sheet", date] });
        }
    };

    const totalChildren = data?.reduce((acc, cell) => acc + cell.children.length, 0) ?? 0;
    const totalPresent = data?.reduce((acc, cell) => acc + cell.children.filter((c) => c.present).length, 0) ?? 0;

    return (
        <div className="bg-white flex flex-col space-y-[20px] w-full min-h-[100vh] p-[16px]">
            <BackTopBar />
            <div>
                <span className="font-medium text-[24px] text-black">주일 예배 출석부</span>
            </div>
            <div className="flex items-center space-x-[12px]">
                <div
                    onClick={() => shiftWeek(-1)}
                    className="cursor-pointer px-[12px] py-[8px] rounded-[8px] bg-brown"
                >
                    <span className="font-medium text-[14px] text-white">이전 주</span>
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-lightGray rounded-[8px] px-[12px] py-[8px] text-[14px] text-black font-medium"
                />
                <div
                    onClick={() => shiftWeek(1)}
                    className="cursor-pointer px-[12px] py-[8px] rounded-[8px] bg-brown"
                >
                    <span className="font-medium text-[14px] text-white">다음 주</span>
                </div>
                <div className="ml-auto">
                    <span className="text-[14px] text-black font-medium">
                        출석 {totalPresent} / {totalChildren}
                    </span>
                </div>
            </div>
            <div className="flex flex-col space-y-[24px]">
                {data?.map((cell) => (
                    <div key={cell.id} className="flex flex-col space-y-[8px]">
                        <div className="flex items-center space-x-[8px]">
                            <span className="font-bold text-[16px] text-black">{cell.name}</span>
                            <span className="text-[13px] text-lightGray font-medium">
                                {cell.children.filter((c) => c.present).length} / {cell.children.length}
                            </span>
                        </div>
                        {cell.children.length === 0 ? (
                            <div className="w-full bg-white shadow-sm px-[8px] py-[8px] rounded-[8px]">
                                <span className="text-[13px] text-lightGray">등록된 셀원이 없습니다.</span>
                            </div>
                        ) : (
                            cell.children.map((child) => (
                                <div
                                    key={child.id}
                                    onClick={() => onToggle(cell.id, child.id, !child.present)}
                                    className="cursor-pointer w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] space-x-[42px] items-center"
                                >
                                    <div className="w-[64px]">
                                        <span className="text-black text-[14px] font-medium whitespace-nowrap">{child.name}</span>
                                    </div>
                                    <div className="border p-[4px] rounded-[10px]">
                                        <span className="text-black text-[14px] font-medium whitespace-nowrap">{child.grade}</span>
                                    </div>
                                    <div className="flex flex-col space-y-[4px]">
                                        <span className="text-black text-[14px] font-medium">{child.zone}</span>
                                        <div className={classNames("w-[40px] h-[8px]", zoneColor(child.zone))}></div>
                                    </div>
                                    <div className="ml-auto">
                                        <div
                                            className={classNames(
                                                "px-[16px] py-[6px] rounded-[8px]",
                                                child.present ? "bg-brown" : "bg-white border border-lightGray"
                                            )}
                                        >
                                            <span
                                                className={classNames(
                                                    "font-medium text-[14px] whitespace-nowrap",
                                                    child.present ? "text-white" : "text-lightGray"
                                                )}
                                            >
                                                {child.present ? "출석" : "결석"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Attendance;
