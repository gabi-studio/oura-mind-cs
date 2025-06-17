//--------------------------
// src/components/Modal.jsx
// This component is a template to display a modal dialog with a title, content, and action buttons
// Accepts props for title, children content, and an array of action buttons
//--------------------------

import './Modal.css';

function Modal({ title, onClose, children, actions = [] }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">

        {/* Modal Header */}
        <div className="modal-header">
          <h3>{title}</h3>

            {/* Close button */}
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        {/* Children content will be rendered here */}
        <div className="modal-body">
          {children}
        </div>

        {/* Modal Actions
        -- This works by mapping over the actions array and rendering a button for each action */}
        <div className="modal-actions">
          {actions.map((a, i) => (
            <button 
              key={i} 
              onClick={a.onClick} 
              className={`action-btn ${a.variant ? `action-btn-${a.variant}` : ''}`}
            >
              {a.label}
            </button>
            
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
