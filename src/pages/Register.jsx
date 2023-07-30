import axios from "axios";
import { useRef, useState } from "react";
import {Link} from "react-router-dom"
import Success from "./Success";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
const Register = ()=>{

    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    function handleSubmit(e){
        e.preventDefault()

        const username = usernameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value

        if(username && email && password){
            axios.post("http://localhost:4000/api/user", {username, email, password})
            .then((res)=>{
                console.log(res);
                setSuccess(true)
            })
            .catch((err)=>{
                console.log(err);
                // setError(err.response.data.message)
                toast.error(err.response.data.message)
            })
        } else {
            toast.error("Please enter all the details")
        }
        
    }

    return(
        <>
            {
                success? <Success /> : (
                    <div className="form-wrapper">
                        <div className="form-wrap">
                        <h2>Register</h2>
                        <form onSubmit={(e)=>handleSubmit(e)}>
                            <input ref={usernameRef} type="text" placeholder="Full name (As per Identity issued by Govt.)" />
                            <input ref={emailRef} type="email" placeholder="Email" />
                            <input ref={passwordRef} type="password" placeholder="Password"/>
                            <p style={{color: "red", fontSize: "0.8rem"}}><em>{error? "*"+error: null}</em></p>
                            <button type="submit">Sign Up</button>
                        </form>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                    </div>
                )
            }
            
        
        </>
    )
}

export default Register;