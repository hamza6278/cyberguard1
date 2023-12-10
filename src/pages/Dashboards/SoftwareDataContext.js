// SoftwareDataContext.js
import { createContext, useContext, useState } from 'react';

const SoftwareDataContext = createContext();

export function useSoftwareData() {
  return useContext(SoftwareDataContext);
}

export function SoftwareDataProvider({ children }) {
  const [softwareData, setSoftwareData] = useState([]);

  const addSoftwareData = (formData) => {
    setSoftwareData([...softwareData, formData]);
  };

  return (
    <SoftwareDataContext.Provider value={{ softwareData, addSoftwareData }}>
      {children}
    </SoftwareDataContext.Provider>
  );
}
