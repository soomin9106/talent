'use server'
import prisma from "@/lib/prisma";
import { CellPost, CellUpdate, ChildAttendanceStatus, ChildGet, ChildrenGet, ICellInfo, IEditStudentInfo, IStudentInfo, MonthlyAttendanceEntry, SetAttendance, SetTeacherAttendance, StudentInfoProps, TeacherAttendanceStatus } from "../_const/interfaces";
const fs = require('fs').promises;
const path = '/Users/imsumin/talent/frontend/app/data.json';

export const getCells = async () => {
    const cells = await prisma.cell.findMany()

    return cells
};

export const getCellsById = async ({ cell_id }: ChildrenGet) => {
    const cell = await prisma.cell.findUnique({
        where: {
            id: cell_id,
        },
    })

    if (cell) {
        return cell
    }

    return { id: 0, name: "", }
};

export const addCell = async ({ name }: CellPost) => {
    try {
        const cell = await prisma.cell.create({
            data: {
                name: name
            },
        })

        return { cell: cell, status: 201 }
    } catch (e) {
        return { status: 500 }
    }
};

export const editCell = async ({ id, name }: CellUpdate) => {
    try {
        const updateCell = await prisma.cell.update({
            where: {
                id: id
            },
            data: {
                name: name
            },
        })

        return { updateCell: updateCell, status: 200 }

    } catch (e) {
        return { statue: 500 }
    }
};

export const getChildren = async ({ cell_id }: ChildrenGet) => {
    try {
        const children = await prisma.child.findMany({
            where: {
                cellId: cell_id
            },
        })

        if (children) {
            return children
        }

        return [{ id: 0, name: "", grade: 0, zone: "", talent: 0, cellId: 0 }]
    } catch (e) {
        return [{ id: 0, name: "", grade: 0, zone: "", talent: 0, cellId: 0 }]
    }
};

export const addChild = async (cell_id: number, props: IStudentInfo) => {
    try {
        const newChild = await prisma.child.create({
            data: {
                name: props.name,
                grade: Number(props.grade),
                zone: props.zone,
                talent: Number(props.talent),
                cellId: cell_id
            },
        })

        return { status: 200, newChild: newChild }
    } catch (e) {
        return { status: 500, error: e }
    }
};

export const editChild = async ({ cell_id, student_id, updatedStudent }: IEditStudentInfo) => {
    try {
        const updateChild = await prisma.child.update({
            where: {
                id: student_id,
                cellId: cell_id
            },
            data: {
                zone: updatedStudent.zone,
                talent: updatedStudent.talent
            },
        })

        return { ...updateChild } // 성공 시 업데이트된 자식 정보 반환
    } catch (e) {
        return { status: 500 } // 실패 시 에러 상태 반환
    }
};


export const getChild = async ({ cell_id, student_id }: ChildGet) => {
    try {
        const child = await prisma.child.findUnique({
            where: {
                id: student_id,
                cellId: cell_id
            },
        })

        if (child) {
            return child
        }

        return { id: 0, name: "", grade: 0, zone: "", talent: 0, cellId: 0 }
    } catch (e) {
        return { id: 0, name: "", grade: 0, zone: "", talent: 0, cellId: 0 }
    }
};

// 주일 예배 출석부 - 특정 날짜의 셀/학생별 출석 상태 조회
export const getAttendanceSheet = async (date: string) => {
    try {
        const targetDate = new Date(`${date}T00:00:00.000Z`)
        const cells = await prisma.cell.findMany({
            include: {
                teachers: true,
                children: {
                    include: {
                        attendances: {
                            where: { date: targetDate },
                        },
                    },
                },
            },
        })

        return cells.map((cell) => ({
            id: cell.id,
            name: cell.name,
            teachers: cell.teachers.map((teacher) => teacher.name),
            children: cell.children.map((child) => ({
                id: child.id,
                name: child.name,
                grade: child.grade,
                zone: child.zone,
                status: (child.attendances[0]?.status ?? "ABSENT") as ChildAttendanceStatus,
            })),
        }))
    } catch (e) {
        return []
    }
};

// 주일 예배 출석부 - 출석 상태(출석/지각/결석) 저장
export const setAttendance = async ({ child_id, date, status }: SetAttendance) => {
    try {
        const targetDate = new Date(`${date}T00:00:00.000Z`)
        const present = status !== "ABSENT"
        const attendance = await prisma.attendance.upsert({
            where: {
                childId_date: {
                    childId: child_id,
                    date: targetDate,
                },
            },
            update: { present, status },
            create: { childId: child_id, date: targetDate, present, status },
        })

        return { status: 200, attendance }
    } catch (e) {
        return { status: 500 }
    }
};

// 주일 예배 출석부 - 특정 날짜의 선생님 출석 상태 조회
export const getTeacherAttendanceSheet = async (date: string) => {
    try {
        const targetDate = new Date(`${date}T00:00:00.000Z`)
        const teachers = await prisma.teacher.findMany({
            include: {
                attendances: {
                    where: { date: targetDate },
                },
            },
            orderBy: { name: "asc" },
        })

        return teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            status: (teacher.attendances[0]?.status ?? "ABSENT") as TeacherAttendanceStatus,
        }))
    } catch (e) {
        return []
    }
};

// 주일 예배 출석부 - 선생님 출석 상태(출석/결석/기도참석) 저장
export const setTeacherAttendance = async ({ teacher_id, date, status }: SetTeacherAttendance) => {
    try {
        const targetDate = new Date(`${date}T00:00:00.000Z`)
        const attendance = await prisma.teacherAttendance.upsert({
            where: {
                teacherId_date: {
                    teacherId: teacher_id,
                    date: targetDate,
                },
            },
            update: { status },
            create: { teacherId: teacher_id, date: targetDate, status },
        })

        return { status: 200, attendance }
    } catch (e) {
        return { status: 500 }
    }
};

// 주일 예배 출석부 - 학생의 한 달 출석 기록 조회 (date가 속한 달 기준)
export const getChildMonthlyAttendance = async (child_id: number, date: string): Promise<MonthlyAttendanceEntry[]> => {
    try {
        const base = new Date(`${date}T00:00:00.000Z`)
        const monthStart = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1))
        const nextMonthStart = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 1))

        const attendances = await prisma.attendance.findMany({
            where: {
                childId: child_id,
                date: { gte: monthStart, lt: nextMonthStart },
            },
            orderBy: { date: "asc" },
        })

        return attendances.map((attendance) => ({
            date: attendance.date.toISOString().slice(0, 10),
            status: attendance.status as ChildAttendanceStatus,
        }))
    } catch (e) {
        return []
    }
};
