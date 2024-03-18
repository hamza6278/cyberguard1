// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    console.log('Adding notification:', message);
    const newNotification = { message, acknowledged: false };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  const acknowledgeNotification = (index) => {
    console.log('Acknowledging notification at index:', index);
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications[index].acknowledged = true;
      return updatedNotifications;
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, acknowledgeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; // Export NotificationContext as default
