// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DataPageContextProvider } from './context/DataPageContext'; // Import the context provider
import FileHasher from './FileHasher';
import FileHasher2 from './FileHasher2';

ReactDOM.render(
  <React.StrictMode>
    <DataPageContextProvider>
      <App />
      
      {/*<FileHasher2/>*/}
    </DataPageContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

