import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/auth.css";

function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async (e) => {

e.preventDefault();

try{

const res = await API.post("/auth/login",{
email,
password
});

localStorage.setItem("token",res.data.token);

navigate("/files");

}catch(error){

console.error(error);
alert("Login failed");

}

};

return(

<div className="auth-container">

<h2>Login</h2>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button type="submit">

Login

</button>

</form>

</div>

);

}

export default Login;