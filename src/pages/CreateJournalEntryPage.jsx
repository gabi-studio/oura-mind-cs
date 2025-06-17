import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navigation from '../components/Reusables/Navigation';
import { createJournalEntry } from '../services/journalService';
import './JournalWritePage.css'; 

function CreateJournalEntryPage() {
  // State to track the journal text input
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Basic validation
    if (!text.trim()) {
      setError('Please write something before submitting.');
      setSubmitting(false);
      return;
    }

    if (text.trim().length < 100) {
      setError('Please write at least 100 characters.');
      setSubmitting(false);
      return;
    }

    try {
      console.log('Creating journal entry...');
      
      // Create the journal entry using the service function
      const newEntry = await createJournalEntry(text.trim());

      console.log('Entry created:', newEntry);

      // Redirect to dashboard for now (we'll change this later)
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating entry:', err);
      // Handle server or network error
      setError(err.message || 'Failed to create journal entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* <Navigation /> */}
      <div className="journal-write-page">
        <div className="journal-write-container">
          <div className="journal-write-header">
            <h2 className="journal-write-title">New Journal Entry</h2>
          </div>

          <div className="journal-write-body">
            {submitting ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Saving your entry...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="journal-form">
                {/* Show error if something goes wrong */}
                {error && (
                  <div className="form-error" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-group">
                    <p>What's on your mind? </p>
                  <label htmlFor="text" className="form-label">
                    Write about your feelings and you will get suggestions for reflections tools to ease your mind, and an affirmation based on your emotions.
                  </label>
                  <textarea
                    id="text"
                    rows="10"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your journal entry here... Share your thoughts, feelings, or what happened today."
                    className="journal-textarea"
                    required
                    disabled={submitting}
                  />
                  <div style={{ 
                    textAlign: 'right', 
                    fontSize: '0.8rem', 
                    color: '#1a1a1a', 
                    opacity: 0.6, 
                    marginTop: '0.5rem' 
                  }}>
                    {text.length} characters
                    {text.length > 0 && text.length < 100 && (
                      <span> (minimum 100)</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting || text.trim().length < 100}
                    className="btn btn-primary"
                  >
                    {submitting ? 'Saving...' : 'Save Entry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateJournalEntryPage;