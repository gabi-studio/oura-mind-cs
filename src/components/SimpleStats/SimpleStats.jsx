//-----------------------------
// src/components/SimpleStats/SimpleStats.jsx
// SimpleStats component displays a simple set of statistics in a grid format
// It accepts an array of stats objects, each with a value and label

import './SimpleStats.css';

// SimpleStats component takes a prop called "stats"
// "stats" array of objects with "value" and "label" properties
function SimpleStats({ stats = [] }) {
  return (
    <div className="simple-stats-container">
      {/* <h2 className="simple-stats-title">Your Journal Stats</h2> */}
      <div className="simple-stats">

        {/* Loop through the stats and displays each one */}
        {stats.map((s, i) => (
          <div key={i} className="simple-stat">
            <p className="simple-stat-number">{s.value}</p>
            <p className="simple-stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimpleStats;
