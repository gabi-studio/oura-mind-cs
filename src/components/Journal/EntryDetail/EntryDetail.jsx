import './EntryDetail.css';
import { formatDateSafe } from '../utils/date'; 

function EntryDetail({ 
  entry, 
  emotions = [], 
  suggestedTools = [], 
  completedTools = [],
  onEdit,
  onDelete 
}) {
  const formatIntensity = (intensity) => {
    return Math.round(intensity * 100) + '%';
  };

  const isToolCompleted = (toolId) => {
    return completedTools.some(tool => tool.id === toolId);
  };

  return (
    <div className="entry-detail-container">
      {/* Entry Header */}
      <div className="entry-header">
        <div className="entry-date">{formatDateSafe(entry.date)}</div>
        <h1 className="entry-title">Journal Entry</h1>
      </div>

      {/* Entry Content */}
      <div className="entry-content">
        <h2 className="entry-content-title">Your Thoughts</h2>
        <p className="entry-text">{entry.text}</p>
      </div>

      {/* Affirmation */}
      {entry.affirmation && (
        <div className="affirmation-section">
          <h2 className="affirmation-title">Your Personal Affirmation</h2>
          <p className="affirmation-text">{entry.affirmation}</p>
        </div>
      )}

      {/* Emotions */}
      {emotions.length > 0 && (
        <div className="emotions-section">
          <h2 className="emotions-title">Emotions Detected</h2>
          <div className="emotions-list">
            {emotions.map((emotion, index) => (
              <div 
                key={emotion.emotion_id || index} 
                className={`emotion-tag ${index < 2 ? 'primary' : ''}`}
              >
                <span>{emotion.name}</span>
                {emotion.intensity && (
                  <span className="emotion-intensity">
                    {formatIntensity(emotion.intensity)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tools */}
      {(suggestedTools.length > 0 || completedTools.length > 0) && (
        <div className="tools-section">
          <h2 className="tools-title">Reflection Tools</h2>
          <p className="tools-description">
            Tools to help you explore and understand your emotions deeper.
          </p>
          
          <div className="tools-grid">
            {completedTools.map((tool) => (
              <div key={`completed-${tool.id}`} className="tool-card completed">
                <div className="tool-header">
                  <div className="tool-info">
                    <div className="tool-name">{tool.name}</div>
                    <div className="tool-description">{tool.description || 'Reflection tool'}</div>
                  </div>
                </div>
                
                <div className="tool-status">
                  <span className="status-badge completed">✓ Completed</span>
                </div>
                
                <div className="tool-actions">
                  <a 
                    href={`/tools/${tool.path}/${entry.id}/view`} 
                    className="tool-btn tool-btn-secondary"
                  >
                    View Response
                  </a>
                  <a 
                    href={`/tools/${tool.path}/${entry.id}/edit`} 
                    className="tool-btn tool-btn-primary"
                  >
                    Edit Response
                  </a>
                </div>
              </div>
            ))}

            {suggestedTools
              .filter(tool => !isToolCompleted(tool.id))
              .map((tool) => (
                <div key={`suggested-${tool.id}`} className="tool-card">
                  <div className="tool-header">
                    <div className="tool-info">
                      <div className="tool-name">{tool.name}</div>
                      <div className="tool-description">{tool.description || 'Reflection tool to help process your emotions'}</div>
                    </div>
                  </div>
                  
                  <div className="tool-status">
                    <span className="status-badge available">Available</span>
                  </div>
                  
                  <div className="tool-actions">
                    <a 
                      href={`/tools/${tool.path}/${entry.id}`} 
                      className="tool-btn tool-btn-primary"
                    >
                      Start Tool
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="entry-actions">
        <div className="entry-actions-left">
          <a href="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </a>
          <a href="/journal/new" className="btn btn-secondary">
            Write New Entry
          </a>
        </div>
        
        <div className="entry-actions-right">
          <button onClick={onEdit} className="btn btn-primary">
            Edit Entry
          </button>
          <button onClick={onDelete} className="btn btn-danger">
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntryDetail;
