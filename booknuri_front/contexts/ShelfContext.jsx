
import React, { createContext, useContext, useState } from 'react';

const ShelfContext = createContext();

export const ShelfProvider = ({ children }) => {
  const [shelfMap, setShelfMap] = useState({}); // { isbn13: { status: 'READING', lifeBook: true } }

  const addToShelf = (isbn13, info = {}) => {
    setShelfMap((prev) => ({
      ...prev,
      [isbn13]: { ...(prev[isbn13] || {}), ...info },
    }));
  };

  const removeFromShelf = (isbn13) => {
    setShelfMap((prev) => {
      const newMap = { ...prev };
      delete newMap[isbn13];
      return newMap;
    });
  };

  const updateShelfBook = (isbn13, updatedFields) => {
    setShelfMap((prev) => ({
      ...prev,
      [isbn13]: { ...(prev[isbn13] || {}), ...updatedFields },
    }));
  };

  return (
    <ShelfContext.Provider
      value={{
        shelfMap,
        addToShelf,
        removeFromShelf,
        updateShelfBook,
      }}
    >
      {children}
    </ShelfContext.Provider>
  );
};

export const useShelf = () => useContext(ShelfContext);
