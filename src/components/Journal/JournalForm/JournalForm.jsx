import { useState } from 'react';
import { LoadingSpinner } from '../../Reusables';
import './JournalForm.css';

function JournalForm({ onSubmit, isLoading = false, error = null }) {
  const [content, setContent] = useState('');
  const [localError, setLocalError] = useState('');
  
  const maxLength = 5000;
  const minLength = 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!content.trim()) {
      setLocalError('Please write something before submitting.');
      return;
    }

    if (content.trim().length < minLength) {
      setLocalError(`Please write at least ${minLength} characters.`);
      return;
    }

    if (content.length > maxLength) {
      setLocalError(`Please keep your entry under ${maxLength} characters.`);
      return;
    }

    // Call the parent's submit handler
    onSubmit(content.trim());
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setLocalError(''); // Clear errors when user starts typing
  };

  const getCharacterCountClass = () => {
    const length = content.length;
    if (length > maxLength * 0.9) return 'character-count error';
    if (length > maxLength * 0.8) return 'character-count warning';
    return 'character-count';
  };

  const displayError = localError || error;

  return (
    <div className="journal-form-container">
      <div className="journal-form-header">
        <h1 className="journal-form-title">Write New Entry</h1>
        <p className="journal-form-subtitle">
          Express your thoughts and feelings. We'll analyze the emotions and provide you with a personalized affirmation.
        </p>
      </div>

      <div className="journal-form-body">
        {isLoading ? (
          <LoadingSpinner text="Analyzing your entry and generating affirmation..." />
        ) : (
          <form onSubmit={handleSubmit} className="journal-form">
            {displayError && (
              <div className="form-error" role="alert">
                {displayError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="content" className="form-label">
                How are you feeling today?
              </label>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing about your day, your thoughts, your feelings... There's no right or wrong way to journal. Just let your thoughts flow."
                className="journal-textarea"
                disabled={isLoading}
                maxLength={maxLength}
              />
              <div className={getCharacterCountClass()}>
                {content.length} / {maxLength} characters
                {content.length < minLength && content.length > 0 && (
                  <span> (minimum {minLength})</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <a href="/dashboard" className="btn btn-secondary">
                Cancel
              </a>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || content.trim().length < minLength}
              >
                Save Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default JournalForm;