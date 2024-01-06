import { useState, useEffect } from 'react';

const useIsMobile = ({ width = 640 }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= width);

  const updateIsMobile = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  useEffect(() => {
    // 이벤트 리스너를 추가하여 창 크기가 변경될 때마다 업데이트
    window.addEventListener('resize', updateIsMobile);

    // 컴포넌트가 마운트 해제되면 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
