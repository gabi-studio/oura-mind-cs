import './LoadingSpinner.css';

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;