//-------------------------------------------------
// /pages/JournalEntryPage.jsx
// This page displays a single Journal Entry in detail.
// It shows:
// --- The written journal text
// --- An uplifting affirmation that matches the top emotion detected in the journal text
// --- Suggested reflection tools for top emotions
// --- A list of completed tools for this entry
// It allows the user to:
// --- Edit the entry,
// --- Delete the entry,
// --- 1Make the entry public or private (generates/removes a public link).
// Uses:
// --- JournalService functions for fetching & deleting.
// --- Child components: Affirmation, ToolSuggestions, CompletedToolList.
//---------------------------------------------------------


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import Navigation from '../components/Reusables/Navigation';
import { getJournalEntry, deleteJournalEntry } from '../services/journalService';
import './JournalEntryPage.css';
import { formatDateSafe } from '.././utils/date';
import ToolSuggestions from '../components/Tools/ToolSuggestions/ToolSuggestions';
import CompletedToolList from '../components/Tools/CompletedToolList/CompletedToolList';
import Affirmation from '../components/Affirmation/Affirmation';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';


function JournalEntryPage() {
  // Using useParams to get the entryId 
  const params = useParams();
  const { entryId: id } = params;

  // Used to navigate/redirect the user after actions like delete or edit
  const navigate = useNavigate();
  
  // Debug logging
  // console.log('Full params object:', params);
  // console.log('Entry ID from params:', id);
  
  // State variables for managing entry data
  const [entryData, setEntryData] = useState(null);

  // States for loading, error, deleting
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // For public link functionality --- false by default
  const [isPublic, setIsPublic] = useState(false);
  const [publicLink, setPublicLink] = useState('');

  // Base API URL from .env file

  const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;



  // Load the journal entry based on the ID from URL parameters
  // If no ID is found, set an error state
  // Otherwise, call loadEntry function to fetch the Journal Entry data
  useEffect(() => {
    if (!id || id === 'undefined') {
      console.error('No valid ID found in URL parameters');
      setError('No entry ID provided in URL');
      setLoading(false);
      return;
    }
    
    loadEntry();
  }, [id]);


  //---------------------------------------
  // loadEntry
  // This function handles fetching the journal entry data from the server
  // It uses the getJournalEntry service function
  //---------------------------------------
  const loadEntry = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading journal entry with ID:', id);
      const data = await getJournalEntry(id);
      console.log('Entry data received:', data);
      
      // Cleaning up the date formatting here to remove time part
      if (data && data.entry && data.entry.date) {

        // Extracting just the date part from 2025-06-12, 9:26:27 a.m. that the database stores
        // ---> '2025-06-12'
        
        if (typeof data.entry.date === 'string' && data.entry.date.includes(',')) {
          data.entry.date = data.entry.date.split(',')[0].trim();
        }
        // console.log('Cleaned entry date:', data.entry.date);
      }
      
      // Store data in state for rendering entry details
      setEntryData(data);

      // For setting public  status and link
      setIsPublic(data.entry.is_public);
      setPublicLink(data.entry.public_token ? `${window.location.origin}/public/${data.entry.public_token}` : '');

      
    } catch (err) {
      console.error('Error loading entry:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  //---------------------------------------
  // handleEdit
  // This function handles the edit action for the journal entry
  // It redirects the user to the edit page for this entry
  const handleEdit = () => {
    navigate(`/journal/${id}/edit`);
  };


  //---------------------------------------
  // handleDelete
  // This function handles the delete action for the journal entry
  // It prompts the user for confirmation before proceeding
  // If confirmed, it calls the deleteJournalEntry service function
  // After successful deletion, it redirects the user to the dashboard
  //---------------------------------------
  const handleDelete = async () => {
    const confirmMessage = 'Are you sure you want to delete this journal entry? This action cannot be undone.';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(true);
      
      console.log('Deleting journal entry:', id);
      await deleteJournalEntry(id);
      
      // console.log('Entry deleted successfully');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // console.error('Error deleting entry:', err);
      alert('Failed to delete entry: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  //---------------------------------------
  // handleMakePublic
  // This function handles making the journal entry public
  // It sends a PUT request to the server to update the entry's public status
  // If successful, it updates setIsPublic state to true to reflect the new public status 
  // Then generates a public link
  //---------------------------------------
  const handleMakePublic = async () => {
    try {
      const response = await fetch(`${API_BASE}/journal/${id}/make-public`, {
        method: 'PUT',
        credentials: 'include',
      });
      const result = await response.json();
      setIsPublic(true);
      setPublicLink(`${window.location.origin}${result.publicLink}`);
    } catch (err) {
      alert('Failed to make public.');
      console.error(err);
    }
  };

  //---------------------------------------
  // handleMakePrivate
  // This function handles making the journal entry private
  // It sends a PUT request to the server to update the entry's public status 
  // If successful, it updates setIsPublic state to false and clears the public link 
  //---------------------------------------

  const handleMakePrivate = async () => {
    try {
      await fetch(`${API_BASE}/journal/${id}/make-private`, {
        method: 'PUT',
        credentials: 'include',
      });
      setIsPublic(false);
      setPublicLink('');
    } catch (err) {
      alert('Failed to make private.');
      console.error(err);
    }
  };

  // If loading, show a loading spinner and message

  if (loading) {
    return (
      <div>
        
        <div className="journal-entry-page">
          <div className="journal-entry-loading">
            <LoadingSpinner />
            <p>Loading journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, show an error message with options to retry or go back to dashboard
  if (error) {
    return (
      <div>
        
        <div className="journal-entry-page">
          <div className="journal-entry-error">
            <h2>Error Loading Entry</h2>
            <p>{error}</p>
            <div className="error-debug-info">
              URL: {window.location.href}<br/>
              ID: {id || 'undefined'}
            </div>
            <button 
              onClick={loadEntry}
              className="error-btn error-btn-primary"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="error-btn error-btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no entry data is found, show a "not found" message with options to go back to dashboard or write a new entry
  if (!entryData || !entryData.entry) {
    return (
      <div>
        
        <div className="journal-entry-page">
          <div className="journal-entry-error">
            <h2>Entry Not Found</h2>
            <p>The journal entry you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="error-btn error-btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // The Journal Entry data
  // These are the properties to expect from the entryData object
  const { entry, topEmotions = [], suggestedTools = [], completedTools = [] } = entryData;

  return (
    <div>
      
      <div className="journal-entry-page">
        <div className="journal-entry-container">
          
          
          {/* Actions Section - 
          -- Back to Dashboard (/dashboard)
          -- Write New Entry (/journal/new)
          -- Edit Entry uses handleEdit (/journal/edit/:id)
          -- Delete Entry uses handleDelete (/journal/delete/:id)
          */}

          <div className="actions-section">
            <div className="actions-left">
              <button 
                onClick={() => navigate('/dashboard')}
                className="action-btn"
              >
                Back to Dashboard
              </button>
              <button 
                onClick={() => navigate('/journal/new')}
                className="action-btn"
              >
                Write New Entry
              </button>
            </div>

            

            
            <div className="actions-right">
              <button 
                onClick={handleEdit}
                className="action-btn action-btn-edit"
                disabled={deleting}
              >
                Edit Entry
              </button>
              <button 
                onClick={handleDelete}
                className="action-btn action-btn-delete"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Entry'}
              </button>
            </div>

            
          </div>

          {/* Public Status Section -
          --- Toggle switch to make entry public or private
          --- By default, the entry is private and only visitble to current user
          ---  */}
          <div className="public-status-section">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={async (e) => {
                    if (e.target.checked) {
                      await handleMakePublic();
                    } else {
                      await handleMakePrivate();
                    }
                  }}
                  disabled={deleting}
                />
                <span className="slider"></span>
              </label>
              <p className="public-status">
                {isPublic
                  ? `This entry is public. `
                  : `This entry is private.`}
              </p>
              {isPublic && (
                <a href={publicLink} target="_blank" rel="noopener noreferrer">
                  View Public Link
                </a>
              )}
            </div>

          {/* Entry Header */}
          <div className="entry-card">
            <div className="entry-header">
              <div className="entry-date">
                On {formatDateSafe(entry.date.includes(',') ? entry.date.split(',')[0].trim() : entry.date)}...
              </div>
              {/* <h1 className="entry-title">You wrote:</h1> */}
            </div>

            {/* Entry Content */}
            <div className="entry-content">
              <h1 className="entry-content-title">You wrote:</h1>
              <p className="entry-text">{entry.text}</p>
            </div>
          </div>

          {/* Detected Emotions --- removing this for now
          --- Keeping it here for development mode*/}
          {/* {topEmotions.length > 0 && (
            <div className="emotions-section">
              <h2 className="emotions-title">Emotions Detected</h2>
              <div className="emotions-list">
                {topEmotions.map((emotion, index) => (
                  <div 
                    key={emotion.emotion_id || index}
                    className={`emotion-tag ${index < 2 ? 'primary' : 'secondary'}`}
                  >
                    <span>{emotion.name}</span>
                    {emotion.intensity && (
                      <span className="emotion-intensity">
                        {Math.round(emotion.intensity * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Affirmation component 
          --- pass top emotion if available
          --- The fallback emotion 'joy' is used if no top emotion is found */}
          <Affirmation emotion={topEmotions.length > 0 ? topEmotions[0].name : 'joy'} />


          {/* Suggested Tools Component 
          --- Displays a list of tools based on the top emotions detected from this Journal Entry*/}
          <ToolSuggestions tools={suggestedTools} entryId={entry.id} />
          
          {/* Completed Tools 
          --- Displays a list of Reflection Tools that have been suggested + completed for this Journal Entry 
          --- Only tools that correspond to the emotion detected on the Journal Entry text are suggested,
          --- So only Suggested tools can be completed */}
          <CompletedToolList tools={completedTools} entryId={entry.id} />

        </div>
      </div>
    </div>
  );
}

export default JournalEntryPage;