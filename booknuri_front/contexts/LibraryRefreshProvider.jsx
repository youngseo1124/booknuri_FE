import {createContext, useState} from 'react';

export const LibraryRefreshContext = createContext();

export const LibraryRefreshProvider = ({ children }) => {
  const [libraryRefreshTrigger, setLibraryRefreshTrigger] = useState(false);

  return (
    <LibraryRefreshContext.Provider value={{ libraryRefreshTrigger, setLibraryRefreshTrigger }}>
      {children}
    </LibraryRefreshContext.Provider>
  );
};
