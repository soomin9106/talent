// 왼쪽 사이드 navbar props 정리
export interface NavbarProps {
    cellList: Cell[] | undefined
    activeCellId: number | null
    setActiveCellId: React.Dispatch<React.SetStateAction<number | null>>
}

// cellList - 셀 정보 관련 interface
export interface Cell {
    name: string
    id: number
}

export interface PerCell {
    name: string
    id: number
}

export interface CellPost {
    name: string
}

export interface CellUpdate extends CellPost {
    id: number
}

// Cellinfo - 각 셀 정보 관련
export interface CellInfoProps {
    activeCellId: number | null
}

export interface ChildrenGet {
    cell_id: number
}

export interface ChildGet {
    cell_id: number
    student_id: number
}

export interface StudentInfoProps {
    id: number;
    name: string;
    grade: number;
    zone: string;
    talent: number;
    cellId: number
}

export interface IStudentInfo {
    name: string;
    grade: any;
    zone: string;
    talent: any;
}

export interface ICellInfo {
    id: number;
    name: string;
    member_count: number;
    student_info: StudentInfoProps[];
}

export interface IEditStudentInfo {
    cell_id: number
    student_id: number
    updatedStudent: StudentInfoProps
}