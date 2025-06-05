import AdminLine from "./AdminLine";
import axios from "axios";
import { useEffect, useState } from "react";
import './admin.css';
//const baseURL = "https://server-three-taupe.vercel.app/api/items";
const baseURL = "http://localhost:3000/api/items"


const Admin = () => {
    const [users,setUsers] = useState([]);
    const getUsers = async () =>{
        try{
            const response = await axios.get(`${baseURL}/getUser`);
            setUsers(response.data);

        }catch(error){
            console.log(error);
        } 
    }
    useEffect(() => {
        getUsers();  
    }, []);
    useEffect(() => {
        console.log('users',users);  
    }, [users]);
    const elements = users.map((data, index) => (
        <AdminLine
          key={index}
          username={data.username}
          password={data.password}
          role={data.role}
          id={data.userId}
          onUserDeleted = {getUsers}
        />
      ));
    console.log(elements);
    return (
        <div className="adminPage">
            <h1>This is the admin Dashboard</h1>
            {elements}
        </div>
    )
}
export default Admin;