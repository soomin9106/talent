// @ts-nocheck
// @ts-ignore
"use client"
import React, { useEffect } from 'react';
import styled from "styled-components";
import { useRouter } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #AF8762;
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  padding: 30px;
  display: flex;
  width: 100%;
  background-color: transparent;
`;

const MenuWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const GifImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시 Google Analytics 이벤트 전송
    sendGAEvent({
      action: 'page_view',
      category: 'Home',
      label: 'Main Page',
    });
  }, []);

  return (
    <Container>
      <HeaderWrapper>
        <div>
          <span className='text-white font-bold'>예명교회 아동부</span>
        </div>
        <MenuWrapper>
          <div className='cursor-pointer' onClick={() => {
            router.push('/cell');
          }}>
            <span className='text-white font-bold'>셀별로 확인하기</span>
          </div>
        </MenuWrapper>
      </HeaderWrapper>
      <ImageWrapper>
        <GifImage src="/main.gif" alt="main gif" />
      </ImageWrapper>
    </Container>
  );
};

export default Home;
