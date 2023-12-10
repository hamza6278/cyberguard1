// DataPageContext.js
import { createContext, useContext, useState } from 'react';

const DataPageContext = createContext();

export function useDataPageContext() {
  return useContext(DataPageContext);
}

export function DataPageContextProvider({ children }) {
  const [data, setData] = useState({});

  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <DataPageContext.Provider value={{ data, updateData }}>
      {children}
    </DataPageContext.Provider>
  );
}
