
import React, { createContext, useContext, useState } from 'react';

const ShelfContext = createContext();

export const ShelfProvider = ({ children }) => {
  const [shelfMap, setShelfMap] = useState({}); // { isbn13: { status: 'READING', lifeBook: true } }
  const [modifiedAt, setModifiedAt] = useState(null); // ✅ 변경 시각 저장용
  const addToShelf = (isbn13, info = {}) => {
    setShelfMap((prev) => ({
      ...prev,
      [isbn13]: { ...(prev[isbn13] || {}), ...info },
    }));
    setModifiedAt(Date.now()); // ✅ 변경 시각 갱신
  };

  const removeFromShelf = (isbn13) => {
    console.log('🧹 removeFromShelf 호출됨:', isbn13); // ✅ 로그 찍자!

    setShelfMap((prev) => {
      const newMap = { ...prev };
      delete newMap[isbn13];
      return newMap;
    });
    setModifiedAt(Date.now()); // ✅ 이거 바뀌는지 확인
  };




  const updateShelfBook = (isbn13, updatedFields) => {
    setShelfMap((prev) => ({
      ...prev,
      [isbn13]: { ...(prev[isbn13] || {}), ...updatedFields },
    }));
    setModifiedAt(Date.now()); // ✅ 변경 시각 갱신
  };

  return (
    <ShelfContext.Provider
      value={{
        shelfMap,
        addToShelf,
        removeFromShelf,
        updateShelfBook,
        modifiedAt, // ✅ 캘린더에 전달
      }}
    >
      {children}
    </ShelfContext.Provider>
  );
};

export const useShelf = () => useContext(ShelfContext);
