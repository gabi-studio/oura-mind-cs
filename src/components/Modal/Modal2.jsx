import './Modal.css';

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button onClick={onClose} className="modal-close-button">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
