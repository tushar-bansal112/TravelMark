import "./login.css"
import {FaMapMarker} from "react-icons/fa"
import {MdCancel} from "react-icons/md"
import axios from "axios";
import {useState,useRef } from "react";

 
export default function Login({ setShowLogin, setCurrentUsername, myStorage}) {
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        };
    
        try {
          const res = await axios.post("/users/login", user);
          setCurrentUsername(res.data.username);
          myStorage.setItem('user', res.data.username);
          setShowLogin(false);
        } catch (err) {
          console.log(err);
          setError(true);
        }
      };

  return (
    <div className="loginContainer">
        <div className="logo">
            <FaMapMarker/>
            TravelMark
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" autoFocus placeholder="username" ref={usernameRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="loginBtn" type="submit">Login</button>
            {error && <span className="failure">Something went wrong!</span>}
        </form>
        <MdCancel 
            className="loginCancel"
            style={{fontSize: 20 , color: 'slateblue'}}
            onClick={() => setShowLogin(false)}
        />
    </div>
  )
}

