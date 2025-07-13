import { Link } from "react-router-dom";
import "../styles/Landing.css";
import Footer from "../components/Reusables/Footer";

export default function LandingPage() {
  return (
    <div className="page">
      <div className="content fade-in">
        <h1 className="title">
          Oura Mind <span className="highlight">Journal</span> 
        </h1>
        <p className="tagline">
          Reflect. Feel. Grow. Your journal to understand your emotions.
        </p>
        

        <div className="buttons">
          <Link to="/login" className="button">Login</Link>
          <Link to="/register" className="button secondary">Register</Link>
        </div>
      </div>
    
    
      
    </div>
    
    
  );                    
   
}
