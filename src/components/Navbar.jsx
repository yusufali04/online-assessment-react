import {Link} from "react-router-dom"
const Navbar = ()=>{

    return(
        <>
            <div className="navbar">
                <h2><em>Welcome</em>, CodeLab</h2>
                    <div>
                        <ul className="nav-links">
                            <Link to="/" style={{textDecoration: "none"}}><li >Home</li></Link>
                            <Link to="/login"><button className="login-btn">Login</button></Link>
                        </ul>
                    </div>
            </div>

                

        
        </>
    )
}

export default Navbar;