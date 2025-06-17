import MoodLineChart from '../components/MoodLineChart/MoodLineChart';
import MoodGrid from '../components/MoodGrid/MoodGrid';
import './Analysis.css';

function Analysis() {
  return (
    <div className="analysis-page">
      <div className="analysis-container">
        
        <div className="page-header">
          <h1 className="page-title">Your Moods Over Time</h1>
          <p className="page-subtitle">See your emotional patterns over time.</p>
        </div>

        <div className="charts-grid">
          <MoodLineChart />
          <MoodGrid />
        </div>
        
      </div>
    </div>
  );
}

export default Analysis;