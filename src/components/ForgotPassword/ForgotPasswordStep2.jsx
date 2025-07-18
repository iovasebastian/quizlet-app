import { useState } from "react";
import loadingAnimation from '../../Svgs/Rolling-1s-200px-signin.svg';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPasswordStep2 = () =>{
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassWord] = useState('');
    const [loading, setLoading] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //const baseURL = "https://server-three-taupe.vercel.app/api/items";
    const baseURL = "http://localhost:3000/api/items";
    const location = useLocation();
    const email = location?.state?.email;

    const handlePassword = async () =>{
        setError('');
        if(password !== confirmPassword){
            setError("Password Missmatch");
            return;
        }
        try{
            const response = await axios.post(`${baseURL}/changePassword`,{
            code: code,
            email: email,
            password:password
            });
            console.log(response);
            navigate('/');
        }catch(error){
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Something went wrong. Please try again later.');
            }
            console.error(error);
        }
        
    }

    return(
        <>
            <div className='center'>
                <div className='glass'>
                    <h1 style={{ textAlign: 'center' }}>Reset your password</h1>
                    <input className = 'usernameSignin' type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
                    <input className = 'usernameSignin' type="password" placeholder="Confirm new Password" onChange={(e) => setConfirmPassWord(e.target.value)} />
                    <input className = 'usernameSignin' type="text" placeholder="Code received on Email" onChange={(e) => setCode(e.target.value)} />
                    {loading?<img src = {loadingAnimation}/>:<button className = 'buttonSignin' onClick={handlePassword}>Change Password</button>}
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </>
    );
}
export default ForgotPasswordStep2;