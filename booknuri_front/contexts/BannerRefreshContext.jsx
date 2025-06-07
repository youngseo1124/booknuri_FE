
import React, { createContext, useState } from 'react';

export const BannerRefreshContext = createContext();

export const BannerRefreshProvider = ({ children }) => {
  const [viewedBookCount, setViewedBookCount] = useState(0);
  const [refreshPrivateBanner, setRefreshPrivateBanner] = useState(false);

  const increaseViewedBookCount = () => {
    setViewedBookCount((prev) => {
      const newCount = prev + 1;

      // 5권마다 배너 리렌더링 트리거
      if (newCount % 5 === 0) {
        setRefreshPrivateBanner((prev) => !prev);
      }

      return newCount;
    });
  };

  return (
    <BannerRefreshContext.Provider
      value={{
        viewedBookCount,
        increaseViewedBookCount,
        refreshPrivateBanner,
      }}
    >
      {children}
    </BannerRefreshContext.Provider>
  );
};
