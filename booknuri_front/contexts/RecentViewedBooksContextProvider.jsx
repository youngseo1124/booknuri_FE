import React, { createContext, useState, useEffect } from 'react';
import { getRecentViewedBooks } from '../apis/apiFunction_mypage';

export const RecentViewedBooksContext = createContext();

export const RecentViewedBooksProvider = ({ children }) => {
  const [recentBooks, setRecentBooks] = useState([]);

  const refreshRecentBooks = async () => {
    try {
      const res = await getRecentViewedBooks();
      setRecentBooks(res.data || []);
    } catch (err) {
      console.error('❌ 최근 본 책 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    refreshRecentBooks(); // 앱 켜질 때 한 번 불러옴
  }, []);

  return (
    <RecentViewedBooksContext.Provider value={{ recentBooks, refreshRecentBooks }}>
      {children}
    </RecentViewedBooksContext.Provider>
  );
};
