import {useState} from "react";
import axios from "axios";

const Login = () => {
  const [username,setUsername] =useState('');
  const [password,setPassword] =useState('');

  const hangleSubmit = async (e) => {
      await  axios.post('http://localhost:8080/auth/login',{
          username,password
      }).then(resp => {

      }).catch(err =>{

      })
  }

    return(
        <div className="login">
            <div className="login-form">
                <div className={"login-form-header"}>
                    <span>Welcome back to padel maniac</span>
                    <span>Login and find your new match</span>
                </div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={"Insert username"}
                />
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={"Insert password"}
                />
                <button onClick={hangleSubmit}>Login</button>
            </div>
        </div>
    )
}

export default Login;