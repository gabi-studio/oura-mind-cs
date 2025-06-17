import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './JournalEntryPage.css'; 
import { formatDateSafe } from '../utils/date';

function PublicEntryPage() {
  const { token } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;

  useEffect(() => {
    const loadPublicEntry = async () => {
      try {
        setLoading(true);
        setError('');

        // Backend route for the public entry: /api/public/:token
        const response = await fetch(`${API_BASE}/public/${token}`);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to load public entry.');
        }

        const data = await response.json();
        setEntry(data.entry);

      } catch (err) {
        console.error('Error loading public entry:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPublicEntry();
  }, [token, API_BASE]);

  if (loading) {
    return (
      <div className="journal-entry-page">
        <div className="journal-entry-loading">
          Loading public entry...
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="journal-entry-page">
        <div className="journal-entry-error">
          <h2>Error</h2>
          <p>{error || 'Entry not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-entry-page">
      <div className="journal-entry-container">
        <div className="entry-card">

          <div className="entry-content">
            <h2 className="entry-content-title">Public Journal Entry</h2>
            <p className="entry-text">{entry.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicEntryPage;
