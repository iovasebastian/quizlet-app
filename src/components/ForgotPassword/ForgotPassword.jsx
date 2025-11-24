import { useState } from "react";
import loadingAnimation from '../../Svgs/Rolling-1s-200px-signin.svg';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () =>{
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const baseURL = process.env.REACT_APP_BASE_URL

    const handleEmail = async () =>{
        setError(false);
        try{
            const response = await axios.post(`${baseURL}/checkEmail`,{
                email
            });
            console.log('Email existing:', response.data);
            const exists = response.data;
            if(exists){
                try{
                    const addCode = await axios.post(`${baseURL}/addCodeToDb`,{
                    email
                });
                console.log(addCode);
                navigate('/forgotPasswordStep2', {state: {email: email}});
                }catch(error){
                    console.error(error);
                } 
                
            }else{
                setError(true);
            }
        }catch(error){
            console.error(error);
        }
    }

    return(
        <>
            <div className='center'>
                <div className='glass'>
                    <h1>Forgot Password</h1>
                    <input className = 'usernameSignin' type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    {loading?<img src = {loadingAnimation}/>:<button className = 'buttonSignin' onClick={handleEmail}>Send code</button>}
                    {error && <p className="error">The provided email doesn't exist!</p>}
                </div>
            </div>
        </>
    );
}
export default ForgotPassword;