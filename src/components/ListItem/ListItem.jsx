// src/components/ListItem.jsx

import './ListItem.css';

function ListItem({ title, subtitle, preview, stats = [], actions = [] }) {
  return (
    <div className="entry-item">
      <div className="entry-item-header">
        <div>
          <h3 className="entry-title">{title}</h3>
          {subtitle && <span className="entry-subtitle">{subtitle}</span>}
        </div>
        <div className="entry-actions">
          {actions.map((a, i) => (
            <button 
              key={i} 
              onClick={a.onClick} 
              className={`action-btn ${a.variant ? `action-btn-${a.variant}` : 'action-btn-primary'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      {preview && (
        <p className="entry-preview">{preview}</p>
      )}
      {stats.length > 0 && (
        <div className="entry-stats">
          {stats.map((s, i) => <span key={i}>{s}</span>)}
        </div>
      )}
    </div>
  );
}

export default ListItem;
