'use client';
import BackTopBar from "@/app/_components/BackTopBar";
import {
    AttendanceCell,
    AttendanceTeacher,
    ChildAttendanceStatus,
    MonthlyAttendanceEntry,
    TeacherAttendanceStatus,
} from "@/app/_const/interfaces";
import {
    getAttendanceSheet,
    getChildMonthlyAttendance,
    getTeacherAttendanceSheet,
    setAttendance,
    setTeacherAttendance,
} from "@/app/_utils/functions";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const CHILD_STATUSES: { value: ChildAttendanceStatus; label: string }[] = [
    { value: "PRESENT", label: "출석" },
    { value: "LATE", label: "지각" },
    { value: "ABSENT", label: "결석" },
];

const TEACHER_STATUSES: { value: TeacherAttendanceStatus; label: string }[] = [
    { value: "PRESENT", label: "출석" },
    { value: "ABSENT", label: "결석" },
    { value: "PRAYER", label: "기도참석" },
];

const childStatusLabel = (status: ChildAttendanceStatus) =>
    CHILD_STATUSES.find((s) => s.value === status)?.label ?? "결석";

const statusChipStyle = (active: boolean, status: string) =>
    classNames(
        "cursor-pointer px-[12px] py-[6px] rounded-[8px] border",
        active
            ? status === "PRESENT"
                ? "bg-brown border-brown"
                : status === "LATE"
                    ? "bg-yellow border-yellow"
                    : status === "PRAYER"
                        ? "bg-green border-green"
                        : "bg-naturalGray border-naturalGray"
            : "bg-white border-lightGray"
    );

const statusChipTextStyle = (active: boolean, status: string) =>
    classNames(
        "font-medium text-[13px] whitespace-nowrap",
        active ? (status === "LATE" || status === "PRAYER" ? "text-black" : "text-white") : "text-lightGray"
    );

const ChildMonthlyHistory = ({ childId, date }: { childId: number; date: string }) => {
    const { data, isLoading } = useQuery<MonthlyAttendanceEntry[]>({
        queryKey: ["child-monthly-attendance", childId, date.slice(0, 7)],
        queryFn: () => getChildMonthlyAttendance(childId, date),
    });

    const [year, month] = date.split("-");

    return (
        <div className="bg-white border border-lightGray rounded-[8px] px-[12px] py-[8px] flex flex-col space-y-[6px]">
            <span className="text-[13px] text-black font-bold">
                {year}년 {Number(month)}월 출석 현황
            </span>
            {isLoading ? (
                <span className="text-[13px] text-lightGray">불러오는 중...</span>
            ) : !data || data.length === 0 ? (
                <span className="text-[13px] text-lightGray">이번 달 출석 기록이 없습니다.</span>
            ) : (
                data.map((entry) => (
                    <div key={entry.date} className="flex items-center justify-between">
                        <span className="text-[13px] text-black">{entry.date}</span>
                        <span
                            className={classNames(
                                "text-[13px] font-medium",
                                entry.status === "PRESENT"
                                    ? "text-brown"
                                    : entry.status === "LATE"
                                        ? "text-naturalGray"
                                        : "text-lightGray"
                            )}
                        >
                            {childStatusLabel(entry.status)}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

const Attendance = () => {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(toDateInputValue(getRecentSunday()));
    const [expandedChildId, setExpandedChildId] = useState<number | null>(null);

    const { data } = useQuery<AttendanceCell[]>({
        queryKey: ["attendance-sheet", date],
        queryFn: () => getAttendanceSheet(date),
        staleTime: 0,
    });

    const { data: teachers } = useQuery<AttendanceTeacher[]>({
        queryKey: ["teacher-attendance-sheet", date],
        queryFn: () => getTeacherAttendanceSheet(date),
        staleTime: 0,
    });

    const shiftWeek = (offset: number) => {
        const current = new Date(`${date}T00:00:00`);
        current.setDate(current.getDate() + offset * 7);
        setDate(toDateInputValue(current));
    };

    const onChangeChildStatus = async (cellId: number, childId: number, status: ChildAttendanceStatus) => {
        queryClient.setQueryData<AttendanceCell[]>(["attendance-sheet", date], (prev) =>
            prev?.map((cell) =>
                cell.id === cellId
                    ? {
                        ...cell,
                        children: cell.children.map((child) =>
                            child.id === childId ? { ...child, status } : child
                        ),
                    }
                    : cell
            )
        );

        const response = await setAttendance({ child_id: childId, date, status });

        if (response.status !== 200) {
            alert("출석 정보 저장에 실패하였습니다.");
        }
        queryClient.invalidateQueries({ queryKey: ["attendance-sheet", date] });
        queryClient.invalidateQueries({ queryKey: ["child-monthly-attendance", childId, date.slice(0, 7)] });
    };

    const onChangeTeacherStatus = async (teacherId: number, status: TeacherAttendanceStatus) => {
        queryClient.setQueryData<AttendanceTeacher[]>(["teacher-attendance-sheet", date], (prev) =>
            prev?.map((teacher) => (teacher.id === teacherId ? { ...teacher, status } : teacher))
        );

        const response = await setTeacherAttendance({ teacher_id: teacherId, date, status });

        if (response.status !== 200) {
            alert("선생님 출석 정보 저장에 실패하였습니다.");
            queryClient.invalidateQueries({ queryKey: ["teacher-attendance-sheet", date] });
        }
    };

    const totalChildren = data?.reduce((acc, cell) => acc + cell.children.length, 0) ?? 0;
    const totalPresent =
        data?.reduce((acc, cell) => acc + cell.children.filter((c) => c.status === "PRESENT").length, 0) ?? 0;
    const totalLate =
        data?.reduce((acc, cell) => acc + cell.children.filter((c) => c.status === "LATE").length, 0) ?? 0;

    return (
        <div className="bg-white flex flex-col space-y-[20px] w-full min-h-[100vh] p-[16px]">
            <BackTopBar />
            <div>
                <span className="font-medium text-[24px] text-black">주일 예배 출석부</span>
            </div>
            <div className="flex items-center space-x-[12px]">
                <div
                    onClick={() => shiftWeek(-1)}
                    aria-label="이전 주"
                    className="cursor-pointer shrink-0 p-[8px] rounded-[8px] bg-brown"
                >
                    <ChevronLeft size={18} className="text-white" />
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-lightGray rounded-[8px] px-[12px] py-[8px] text-[14px] text-black font-medium"
                />
                <div
                    onClick={() => shiftWeek(1)}
                    aria-label="다음 주"
                    className="cursor-pointer shrink-0 p-[8px] rounded-[8px] bg-brown"
                >
                    <ChevronRight size={18} className="text-white" />
                </div>
                <div className="ml-auto">
                    <span className="text-[14px] text-black font-medium whitespace-nowrap">
                        출석 {totalPresent} · 지각 {totalLate} / {totalChildren}
                    </span>
                </div>
            </div>
            <div className="flex flex-col space-y-[8px]">
                <div className="flex items-center space-x-[8px]">
                    <span className="font-bold text-[16px] text-black">선생님</span>
                    <span className="text-[13px] text-lightGray font-medium">
                        {teachers?.filter((t) => t.status === "PRESENT").length ?? 0} / {teachers?.length ?? 0}
                    </span>
                </div>
                {!teachers || teachers.length === 0 ? (
                    <div className="w-full bg-white shadow-sm px-[8px] py-[8px] rounded-[8px]">
                        <span className="text-[13px] text-lightGray">등록된 선생님이 없습니다.</span>
                    </div>
                ) : (
                    teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] items-center"
                        >
                            <div className="w-[64px]">
                                <span className="text-black text-[14px] font-medium whitespace-nowrap">
                                    {teacher.name}
                                </span>
                            </div>
                            <div className="ml-auto flex space-x-[6px]">
                                {TEACHER_STATUSES.map(({ value, label }) => (
                                    <div
                                        key={value}
                                        onClick={() => onChangeTeacherStatus(teacher.id, value)}
                                        className={statusChipStyle(teacher.status === value, value)}
                                    >
                                        <span className={statusChipTextStyle(teacher.status === value, value)}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="flex flex-col space-y-[24px]">
                {data?.map((cell) => (
                    <div key={cell.id} className="flex flex-col space-y-[8px]">
                        <div className="flex items-center space-x-[8px] flex-wrap">
                            <span className="font-bold text-[16px] text-black">{cell.name}</span>
                            {cell.teachers.length > 0 && (
                                <span className="text-[13px] text-naturalGray font-medium whitespace-nowrap">
                                    담당 : {cell.teachers.join(", ")}
                                </span>
                            )}
                            <span className="text-[13px] text-lightGray font-medium">
                                {cell.children.filter((c) => c.status === "PRESENT").length} / {cell.children.length}
                            </span>
                        </div>
                        {cell.children.length === 0 ? (
                            <div className="w-full bg-white shadow-sm px-[8px] py-[8px] rounded-[8px]">
                                <span className="text-[13px] text-lightGray">등록된 셀원이 없습니다.</span>
                            </div>
                        ) : (
                            cell.children.map((child) => (
                                <div key={child.id} className="flex flex-col space-y-[4px]">
                                    <div className="w-full bg-white flex shadow-sm px-[8px] py-[8px] rounded-[8px] space-x-[16px] items-center">
                                        <div
                                            onClick={() =>
                                                setExpandedChildId((prev) => (prev === child.id ? null : child.id))
                                            }
                                            className="cursor-pointer w-[64px]"
                                        >
                                            <span className="text-black text-[14px] font-medium whitespace-nowrap underline">
                                                {child.name}
                                            </span>
                                        </div>
                                        <div className="border p-[4px] rounded-[10px]">
                                            <span className="text-black text-[14px] font-medium whitespace-nowrap">
                                                {child.grade}
                                            </span>
                                        </div>
                                        <div className="flex flex-col space-y-[4px]">
                                            <span className="text-black text-[14px] font-medium">{child.zone}</span>
                                            <div className={classNames("w-[40px] h-[8px]", zoneColor(child.zone))}></div>
                                        </div>
                                        <div className="ml-auto flex space-x-[6px]">
                                            {CHILD_STATUSES.map(({ value, label }) => (
                                                <div
                                                    key={value}
                                                    onClick={() => onChangeChildStatus(cell.id, child.id, value)}
                                                    className={statusChipStyle(child.status === value, value)}
                                                >
                                                    <span className={statusChipTextStyle(child.status === value, value)}>
                                                        {label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {expandedChildId === child.id && (
                                        <ChildMonthlyHistory childId={child.id} date={date} />
                                    )}
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
