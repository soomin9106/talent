"use client"
import Navbar from "@/app/_components/Navbar"
import type { Cell } from "@/app/_const/interfaces";
import { getCells } from "@/app/_utils/functions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";

const NavDiv = styled.div`
  width: 100%;
`;

const ContentDiv = styled.div`
  width: 90%;
`;

const Cell = () => {
    const [activeCellId, setActiveCellId] = useState<number | null>(null)

    const { data } = useQuery<Cell[]>({
        queryKey: ["cells-list"],
        queryFn: () => getCells(),
        staleTime: 5 * 1000,
    });

    return (
        <div className="w-full flex">
            <NavDiv>
                <Navbar activeCellId={activeCellId} setActiveCellId={setActiveCellId} cellList={data} />
            </NavDiv>
        </div>
    )
}

export default Cell