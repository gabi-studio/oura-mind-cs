import './EntryResult.css';
import { formatDateSafe } from '../utils/date'; // adjust the path if needed

function EntryResult({ 
  entry, 
  affirmation, 
  emotions = [], 
  suggestedTools = [] 
}) {
  return (
    <div className="entry-result-container">
      {/* Success Message */}
      <div className="result-success">
        <div className="result-success-icon">✓</div>
        <h1 className="result-success-title">Entry Saved Successfully!</h1>
        <p className="result-success-message">
          Your journal entry for {formatDateSafe(entry.date)} has been saved and analyzed.
        </p>
      </div>

      {/* Affirmation */}
      {affirmation && (
        <div className="affirmation-card">
          <h2 className="affirmation-title">Your Personal Affirmation</h2>
          <p className="affirmation-text">{affirmation}</p>
        </div>
      )}

      {/* Emotions */}
      {emotions.length > 0 && (
        <div className="emotions-section">
          <h2 className="emotions-title">Emotions Detected</h2>
          <div className="emotions-list">
            {emotions.map((emotion, index) => (
              <span 
                key={emotion.name || index} 
                className={`emotion-tag ${index < 2 ? 'primary' : ''}`}
              >
                {emotion.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tools */}
      {suggestedTools.length > 0 && (
        <div className="tools-section">
          <h2 className="tools-title">Reflection Tools for You</h2>
          <p className="tools-description">
            Based on your emotions, here are some tools that might help you reflect and grow:
          </p>
          <div className="tools-list">
            {suggestedTools.map((tool) => (
              <div key={tool.id} className="tool-item">
                <div className="tool-info">
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-description">{tool.description}</div>
                </div>
                <a 
                  href={`/tools/${tool.path}/${entry.id}`} 
                  className="tool-link"
                >
                  Start Tool
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="result-actions">
        <a href="/journal/new" className="btn btn-secondary">
          Write Another Entry
        </a>
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default EntryResult;
