import React from 'react';
import axios from 'axios';
const baseURL = "https://server-three-taupe.vercel.app/api/items/admin/";
//const baseURL = "http://localhost:3000/api/items/admin/";
const token = localStorage.getItem("token");
const AdminLine = (props) => {
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${baseURL}${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('User deleted successfully:', response.data);
      props.onUserDeleted();
      // You can update your state or perform other actions as needed
    } catch (error) {
      console.log('USER ID', userId);
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="adminLine">
      <p className='pAdmin'>Username: {props.username}</p>
      <p className='pAdmin'>Password: {props.password}</p>
      <p className='pAdmin'>Role: {props.role}</p>
      <button className = 'deleteAdmin' onClick={() => deleteUser(props.id)}>Delete</button>
    </div>
  );
};

export default AdminLine;
