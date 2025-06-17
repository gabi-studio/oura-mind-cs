//---------------------------------------
// /pages/JournalWritePage.jsx
//
// This page lets the user create a new Journal Entry
// It includes:
// --- A large textarea
// --- Character counter + minimum length
// --- Validation & submit handling
// --- Redirects to the new entry view page on success
// Uses:
// --- useNavigate for redirect after save
// --- JournalService.createJournalEntry for backend call
//---------------------------------------

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navigation from '../components/Reusables/Navigation';
import { createJournalEntry } from '../services/journalService';
import './JournalWritePage.css';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

function CreateJournalEntryPage() {
  // text is the text in the textarea while writing
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

    //---------------------------------------
  // handleSubmit:
  // Validates input, sends create request,
  // Redirects to new Journal Entry page on success
  //---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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
      // console.log('Creating journal entry...');

      // Call the service to create a new journal entry
      // createJournalEntry returns the new entry object
      const newEntry = await createJournalEntry(text.trim());
      // console.log('Entry created:', newEntry);

      // Redirect to the newly created entry page using the correct ID
      navigate(`/journal/${newEntry.entry.id}`);
    } catch (err) {
      console.error('Error creating entry:', err);
      setError(err.message || 'Failed to create journal entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      
      <div className="journal-write-page">
        <div className="journal-write-container">
          <div className="journal-write-header">
            <h1 className="journal-write-title">New Journal Entry</h1>
          </div>

          <div className="journal-write-body">
            {submitting ? (
              <div className="loading-state">
                <div className="loading-spinner">
                  <LoadingSpinner />
                </div>
                <p>Saving your entry...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="journal-form">
                {error && (
                  <div className="form-error" role="alert">
                    {error}
                  </div>
                )}

                {/* Text box to write Journal Entry */}
                <div className="form-group">
                  <label htmlFor="text" className="form-label">
                    <p>How are you today? </p>
                    <p>Write about your feelings and you will get suggestions for reflection tools and an affirmation based on your emotions.</p>
                  </label>
                  <textarea
                    id="text"
                    rows="10"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your journal entry here..."
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

                    {/* Minimum character count */}
                    {text.length} characters
                    {text.length > 0 && text.length < 100 && (
                      <span> (minimum 100)</span>
                    )}
                  </div>
                </div>

                {/* Form actions with Cancel and Save buttons */} 
                <div className="form-actions">

                  {/* Cancel button leading back to dashboard */}
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  {/* Submit button is disabled if submitting or text is less than 100 characters */}
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
