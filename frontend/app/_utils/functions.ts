'use server'
import prisma from "@/lib/prisma";
import { CellPost, CellUpdate, ChildGet, ChildrenGet, ICellInfo, IEditStudentInfo, IStudentInfo, StudentInfoProps } from "../_const/interfaces";
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
