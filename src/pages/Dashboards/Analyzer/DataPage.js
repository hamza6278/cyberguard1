// DataPage.js
import React from 'react';
import { useDataPageContext } from './DataPageContext';

function DataPage() {
  const { data } = useDataPageContext();

  return (
    <div>
      <h2>Data Page</h2>
      <p>Date: {data.date}</p>
      <p>Contact: {data.contact}</p>
      <p>Functionality: {data.functionality}</p>
      <p>Department: {data.department}</p>
    </div>
  );
}

export default DataPage;
