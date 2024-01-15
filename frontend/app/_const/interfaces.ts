// 왼쪽 사이드 navbar props 정리
export interface NavbarProps {
    cellList: Cell[]
    activeCellId: number | null
    setActiveCellId: React.Dispatch<React.SetStateAction<number | null>>
}

// cellList - 셀 정보 관련 interface
export interface Cell {
    name: string
    id: number
}

// Cellinfo - 각 셀 정보 관련
export interface CellInfoProps {
    activeCellId: number | null
}

export interface StudentInfoProps {
    name: string;
    grade: number;
    zone: string;
    talent: number;
}

export interface CellInfo {
    id: number;
    name: string;
    member_count: number;
    student_info: StudentInfoProps[];
}