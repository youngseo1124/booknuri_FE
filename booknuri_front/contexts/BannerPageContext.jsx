import React, { createContext, useState } from 'react';

export const BannerPageContext = createContext();

export const BannerPageProvider = ({ children }) => {
  const [currentBannerPage, setCurrentBannerPage] = useState(1);
  const [viewedCount, setViewedCount] = useState(0);

  const increaseViewedBookCount = () => {
    setViewedCount((prev) => {
      const next = prev + 1;

      // ✅ 5권 봤을 때만 currentBannerPage를 초기화 (리렌더 트리거)
      if (next % 5 === 0) {
        // 예: 페이지를 강제로 1로 초기화해서 배너 key 재설정하게 만들기
        setCurrentBannerPage(1); // 또는 setCurrentBannerPage(prev => prev + 1);
      }

      return next;
    });
  };

  return (
    <BannerPageContext.Provider
      value={{ currentBannerPage, setCurrentBannerPage, increaseViewedBookCount }}
    >
      {children}
    </BannerPageContext.Provider>
  );
};
