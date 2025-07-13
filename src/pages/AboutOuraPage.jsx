import "../styles/About.css";
import Footer from "../components/Reusables/Footer";

export default function AboutOuraPage() {
  return (
    <div className="about-page fade-in">
      <h1 className="about-title">About <span className="oura-glow">Oura Mind</span> Journal</h1>

      <p className="about-text">
        Oura Mind is a journaling app designed to help you explore your thoughts and feelings with intention.
        It uses emotion-aware AI to detect patterns in your entries, then suggests tools to help you reflect and grow.
      </p>

      <p className="about-text">
        All your journal entries are encrypted for your privacy. You’ll also receive affirmations and insights to support
        your emotional wellness over time.
      </p>

      <p className="about-text">
        Whether you’re working through something, celebrating growth, or simply checking in with yourself, Oura Mind is your space.
      </p>
      
    </div>
    
  );
}
