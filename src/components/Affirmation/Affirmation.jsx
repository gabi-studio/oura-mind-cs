import { useState, useEffect } from 'react';
import './Affirmation.css';

// Affirmation component
// - Fetches an affirmation based on the given emotion
// - Defaults to "joy" if no emotion is passed
// - Lets the user get a new affirmation with a button

function Affirmation({ emotion = 'joy' }) {
  // State to hold the fetched affirmation text
  const [affirmation, setAffirmation] = useState('');

  // State to show loading state
  const [loading, setLoading] = useState(true);

  // State to handle errors
  const [error, setError] = useState('');

  // Function to fetch an affirmation from EmotiQuote API
  const fetchAffirmation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://emotiquote-api.onrender.com/api/quotes/emotion/${emotion}`);
      const data = await res.json();

      // If we get an array of results, pick a random one
      if (Array.isArray(data) && data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setAffirmation(random.affirmation);
      } else {
        // Fallback if API returns empty
        setAffirmation("You are enough, you will always be enough, and you are capable of amazing things.");
      }
    } catch (err) {
      console.error('Error fetching affirmation:', err);
      setError('Failed to load affirmation.');
      setAffirmation("You are enough, you will always be enough, and you are capable of amazing things.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch an affirmation when the component mounts or emotion changes
  useEffect(() => {
    fetchAffirmation();
  }, [emotion]);

  return (
    <div className="affirmation-card">
      <h2>An Affirmation for You</h2>

      {loading ? (
        // Show while loading
        <p>Loading affirmation...</p>
      ) : error ? (
        // Show error message if fetch fails
        <p>{error}</p>
      ) : (
        // Show the affirmation text
        <blockquote className="affirmation-text">"{affirmation}"</blockquote>
      )}

      {/* Button to get a new affirmation */}
      <button onClick={fetchAffirmation} className="action-btn action-btn-primary">
        Get New Affirmation
      </button>
    </div>
  );
}

export default Affirmation;
