import {Link, useNavigate} from "react-router-dom"
import { useState, useContext } from "react"
import axios from "axios"
import userContext from "../userContext"
import Cookies from "universal-cookie"
import toast from 'react-hot-toast'

const Navbar = ()=>{

    const navigate = useNavigate()
    const {user, setUser} = useContext(userContext)
    const cookies = new Cookies()

    const handleLogout = ()=>{
        axios.post('http://localhost:4000/logout')
        .then((res)=>{
            console.log(res);
            setUser(null)
            cookies.remove('user')
            navigate('/')
            toast.success('Logged out successfully')
        })
        .catch((err)=>{
            console.log(err);
            toast.error('Something went wrong')
        })
    }

    return(
        <>
        <div style={{width: '100%', backgroundColor: '#49416D'}}>
            <div className="navbar">
                
                        <h2><em>Welcome, </em> {user? user.username : 'to BrainPulse'} {user && user.role === "admin"? "(Admin)" : ''}</h2>
                        <div>
                            <ul className="nav-links">
                                <Link to="/" style={{textDecoration: "none", color: '#fff'}}><li >Home</li></Link>
                                {
                                    
                                    user ? (
                                        <>
                                          {user.role !== 'admin' ? (
                                            <Link to={`/results/${user._id}`} style={{ textDecoration: "none", color: '#fff' }}>
                                              <li>My Results</li>
                                            </Link>
                                          ) : null}
                                          <Link onClick={handleLogout}>
                                            <button style={{ backgroundColor: "red" }} className="logout-btn">Logout</button>
                                          </Link>
                                        </>
                                      ) : (
                                        <Link to="/login">
                                          <button className="login-btn">Login</button>
                                        </Link>
                                      )
                                }
                                
                            </ul>
                        </div>
            </div>
                
        </div>

                

        
        </>
    )
}

export default Navbar;