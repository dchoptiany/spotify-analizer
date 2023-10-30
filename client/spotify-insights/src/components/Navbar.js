import { Link } from "react-router-dom";


const Navbar = ({user}) =>{
    return (
        <div className = "navbar">
            <span className="logo">
                <Link className="link" to="/">
                    Spotify-insights
                </Link>
      </span>{
            user ? (
                <ul className="list">
                    <li className = "listItem">
                        <img scr="" alt="" className="avatar"></img>
                    </li>
                    <li className="listItem">user</li>
                    <li className="listItem">Logout</li>
                </ul>
            )
            : (<Link className = "link" to="login">Login</Link>)}
        </div>
    )
}

export default Navbar