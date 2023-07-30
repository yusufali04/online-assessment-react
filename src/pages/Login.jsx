import { useRef, useContext } from "react"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import userContext from "../userContext";
import { toast } from "react-hot-toast";

const Login = ()=>{
    const navigate = useNavigate()
    const emailRef = useRef()
    const passwordRef = useRef()
    const {setUser} = useContext(userContext)


    function handleSubmit(e){
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        if(email && password){
            axios.post('http://localhost:4000/login', {email, password},  { withCredentials: true })
            .then(res=>{
                console.log(res)
                setUser(res.data.user)    
                navigate("/")
                if(res.data.user.role === "admin") toast.success('Logged in as Admin')
                else toast.success('You have been logged in successfully')
            })
            .catch((err)=>{
                console.log(err.response);
                toast.error(err.response.data.message)
        })
        } else {
            toast.error("Please enter all the details")
        }
        
    }

    return(
        <>
            <div className="form-wrapper">
                <div className="form-wrap">
                        <h2>Login</h2>
                        <form onSubmit={(e)=>handleSubmit(e)}>
                            <input ref={emailRef} type="email" placeholder="Email" />
                            <input ref={passwordRef} type="password" placeholder="Password" />
                            <button type="submit">Login</button>
                        </form>
                        <p>Do not have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </>
        
    )
}

export default Login;