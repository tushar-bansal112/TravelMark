import "./register.css"
import {FaMapMarker} from "react-icons/fa"
import {MdCancel} from "react-icons/md"
import axios from "axios";
import {useState,useRef } from "react";


export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };
    
        try {
          await axios.post("/users/register", newUser);
          setError(false);
          setSuccess(true);
        } catch (err) {
          setError(true);
        }
      };

  return (
    <div className="registerContainer">
        <div className="logo">
            <FaMapMarker/>
            TravelMark
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" autoFocus placeholder="username" ref={usernameRef}/>
            <input type="email" placeholder="e-mail" ref={emailRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="registerBtn" type="submit">Register</button>
            {success && (
                <span className="success">Successfull. You can login now!</span>
            )}
            {error && <span className="failure">Something went wrong!</span>}
        </form>
        <MdCancel 
            className="registerCancel"
            style={{fontSize: 20}}
            onClick={() => setShowRegister(false)}
        />
    </div>
  )
}

