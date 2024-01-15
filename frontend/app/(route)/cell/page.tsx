"use client"
import CellInfo from "@/app/_components/CellInfo";
import Navbar from "@/app/_components/Navbar"
import { useState } from "react";
import styled from "styled-components";

const NavDiv = styled.div`
  width: 100%;
`;

const ContentDiv = styled.div`
  width: 90%;
`;

const Cell = () => {
    const [activeCellId, setActiveCellId] = useState<number | null>(null)

    // mock data (temp) - api call 필요
    const cellList = [
        {
            id: 1,
            name: "대한민국"
        },
        {
            id: 2,
            name: "일본"
        },
        {
            id: 3,
            name: "대만"
        },
        {
            id: 4,
            name: "스위스"
        },
        {
            id: 5,
            name: "영국"
        },
        {
            id: 6,
            name: "이스라엘"
        }
    ]
    return (
        <div className="w-full flex">
            <NavDiv>
                <Navbar activeCellId={activeCellId} setActiveCellId={setActiveCellId} cellList={cellList} />
            </NavDiv>
        </div>
    )
}

export default Cell