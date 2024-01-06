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