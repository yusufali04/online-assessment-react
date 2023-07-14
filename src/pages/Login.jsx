import { useRef, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
const Login = ()=>{
    const navigate = useNavigate()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState(null)

    function handleSubmit(e){
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        axios.post("http://localhost:4000/login", {email, password})
        .then(res=>{
            console.log(res)
            navigate("/")
        })
        .catch((err)=>setError(err.response.data.message))
    }

    return(
        <div className="form-wrapper">
            <div className="form-wrap">
                    <h2>Login</h2>
                    <form onSubmit={(e)=>handleSubmit(e)}>
                        <input ref={emailRef} type="email" name="" id="" placeholder="Email" />
                        <input ref={passwordRef} type="password" name="" id="" placeholder="Password" />
                        <p style={{color: "red", fontSize: "0.8rem"}}><em>{error? "*"+error: null}</em></p>
                        <button type="submit">Login</button>
                    </form>
                    <p>Do not have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login;