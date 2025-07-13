import { Link, useLocation } from "react-router-dom";
import "../Reusables/Navigation.css"; 

export default function PublicNavbar() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-left">
        <h1 className="nav-title">
            <Link 
                to="/" 
                className="nav-link">
                Oura Mind
            </Link>   
        </h1>
        <div className="nav-links">
          <Link
            to="/about"
            className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
          >
            About The Journal
          </Link>
        </div>
      </div>

      <div className="nav-right">
        <Link
          to="/login"
          className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
