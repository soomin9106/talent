"use client"
import styled from "styled-components";
import { NavbarProps } from "../_const/interfaces"
import classNames from "classnames";
import useIsMobile from "../_hooks/useIsMobile";
import { useState } from "react";

const Navbar = ({ cellList, activeCellId, setActiveCellId }: NavbarProps) => {
    const isMobile = useIsMobile({ width: 640 })
    const [showNavigation, setShowNavigation] = useState(false);

    const toggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };

    const closeNavigation = () => {
        setShowNavigation(false);
    };

    console.log(isMobile);
    
    return (
        <div>
            {isMobile ? (
                <div>
                    {/* 햄버거 버튼 */}
                    <div onClick={toggleNavigation}>눌러라</div>
                    {/* 모바일 네비게이션 */}
                    {showNavigation && (
                        <nav className="flex flex-col h-[100vh] bg-white w-[200px] items-center space-y-[48px]">
                            {/* 내용 */}
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
                                            closeNavigation();
                                        }}
                                    >
                                        <span className={classNames("font-medium text-[15px]", activeCellId === value.id ? "text-white" : "text-lightGray")}>
                                            {value.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    )}
                </div>
            ) : (
                // 모바일이 아닌 경우
                <nav className="flex flex-col h-[100vh] bg-white w-[200px] items-center space-y-[48px]">
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
                                }}
                            >
                                <span className={classNames("font-medium text-[15px]", activeCellId === value.id ? "text-white" : "text-lightGray")}>
                                    {value.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
}

export default Navbar