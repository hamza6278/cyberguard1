import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DataPageContextProvider } from './context/DataPageContext';
import { NotificationProvider } from './context/NotificationContext'; // Corrected import path

ReactDOM.render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
    {/*<FileHasher2/>*/}
  </React.StrictMode>,
  document.getElementById('root')
);
