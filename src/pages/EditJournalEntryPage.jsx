//---------------------------------------
// /pages/EditJournalEntryPage.jsx
//
// This page allows the user to edit an existing journal entry
// It fetches the entry by ID, pre-fills the textarea,
// validates edits, and updates the entry via the JournalService.
// Uses:
// --- useParams for reading entry ID from URL.
// --- useNavigate for programmatic navigation.
// --- Reuses JournalWritePage styling and structure.
//--------------------------------------------

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Reusables/Navigation';
import { getJournalEntry, updateJournalEntry } from '../services/journalService';
import './JournalWritePage.css'; // Reusing Journal write style
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';



function EditJournalEntryPage() {

  // Extracting entry ID from URL parameters
  const { entryId: id } = useParams();
  const navigate = useNavigate();
  
  // text is the text in the textarea while editing
  // originalText is the text when the entry was loaded
  // Will compare themto check for changes
  const [text, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      setError('');
      
      // console.log('Loading entry for editing:', id);
      // Fetch the journal entry by ID
      // getJournalEntry from journalService returns an object with an 'entry' property that contains the entry data
      const data = await getJournalEntry(id);
      
      // If the entry is found, set that to text and originalText state
      if (data && data.entry) {
        setText(data.entry.text);
        setOriginalText(data.entry.text);
      } else {
        setError('Entry not found');
      }
      
    } catch (err) {
      console.error('Error loading entry:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  //---------------------------------------
  // handleSubmit:
  // Validates input, detects changes,
  // Sends update request to server,
  // If successful, updates the originalText state with the new text,
  // Then redirects to the updated entry view.
  //---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // If the text is empty or less than 100 characters, show an error
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

    // If the text is the same as originalText,
    // Do not allow submission
    // Show an error message
    if (text.trim() === originalText.trim()) {
      setError('No changes detected.');
      setSubmitting(false);
      return;
    }

    try {
      // console.log('Updating journal entry...');
      
      // Call the updateJournalEntry function from journalService
      // It takes the entry ID and the new text as parameters
      // updateJournalEntry returns the updated entry object
      await updateJournalEntry(id, text.trim());
      
      // console.log('Entry updated successfully');

      // Redirect to the entry view page
      navigate(`/journal/${id}`);
    } catch (err) {
      console.error('Error updating entry:', err);
      setError(err.message || 'Failed to update journal entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  //---------------------------------------
  // handleCancel:
  // Checks for unsaved changes by comparing text and originalText
  // Confirms cancel with user if edits are present
  // Navigates back to entry view
  //---------------------------------------
  const handleCancel = () => {
    if (text !== originalText) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate(`/journal/${id}`);
      }
    } else {
      navigate(`/journal/${id}`);
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="journal-write-page">
          <div className="loading-state">
            <div className="loading-spinner">
              <LoadingSpinner text="Loading your journal entry..." />
            </div>
            <p>Loading entry...</p>
          </div>
        </div>
      </div>
    );
  }

  // If there is an error and no text is loaded
  // Show the error message and a button to go back to the dashboard
  if (error && !text) {
    return (
      <div>
        <Navigation />
        <div className="journal-write-page">
          <div className="journal-write-container">
            <div className="journal-write-body">
              <div className="form-error" role="alert">
                {error}
              </div>
              <div className="form-actions">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="journal-write-page">
        <div className="journal-write-container">
          <div className="journal-write-header">
            <h2 className="journal-write-title">Edit Journal Entry</h2>
          </div>

          <div className="journal-write-body">
            {submitting ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Updating your entry...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="journal-form">
                {error && (
                  <div className="form-error" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="text" className="form-label">
                    Edit your thoughts and feelings
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
                    {text.length} characters
                    {text.length > 0 && text.length < 100 && (
                      <span> (minimum 100)</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={handleCancel}
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
                    {submitting ? 'Updating...' : 'Update Entry'}
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

export default EditJournalEntryPage;