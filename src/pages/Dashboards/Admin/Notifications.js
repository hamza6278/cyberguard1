import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationContext from '../../../context/NotificationContext'; // Adjust the path based on your project structure
import axios from 'axios';

function AdminSidebar() {
  const navigate = useNavigate();
  const [notifications,setNotifications] = useState()
  const [fullName, setFullName] = useState('');

  useEffect(() => {
  const fetchNotifications=async()=>{
    const response = await axios.get('http://localhost:3028/notifications')
    setNotifications(response.data)
console.log(response.data)

    // setNotifications(response.data[0]);

  } 
  fetchNotifications() 
  }, []);

  // Log received notifications
  const handleSend = async(contact)=>{
    try{
        await axios({
            method:"post",
            baseURL:"http://localhost:3028",
            url:"/addNoti/",
            data:contact
        })
        alert("Sent")
        navigate("/")
    }catch{

    }
  }
  return (
    <div className="" >
      <h1>NOTIFICATIONS</h1>
      <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Contact</th>
          <th>Functionality</th>
          <th>Department</th>
          {/* <th>Send Forward</th> */}
        </tr>
      </thead>
      <tbody>
        {notifications?.map((notification, index) => (
          <tr key={index}>
            <td>{notification.date}</td>
            <td>{notification.contact}</td>
            <td>{notification.functionality}</td>
            <td>{notification.department}</td>
            {/* <td><button onClick={()=>handleSend(notification)}>Send</button></td> */}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default AdminSidebar;
