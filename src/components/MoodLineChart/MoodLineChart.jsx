import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './MoodLineChart.css';

function MoodLineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchMoodData();
  }, [currentDate]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL || 'http://localhost:5000/api';
      
      // Calculate start and end dates for the selected month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const response = await fetch(`${API_BASE}/journal/mood-trends?startDate=${startDate}&endDate=${endDate}&emotions=joy,fear,sadness,anger,disgust`, {
        credentials: 'include',
      });
      const result = await response.json();
      setData(result.trends || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getMonthLabel = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (data.length === 0) return <div className="no-data">No mood data available for {getMonthLabel()}</div>;

  return (
    <div className="line-chart-container">
      <div className="chart-header">
        <button onClick={() => navigateMonth(-1)} className="nav-button">‹</button>
        <h3 className="chart-title">Mood Trends - {getMonthLabel()}</h3>
        <button onClick={() => navigateMonth(1)} className="nav-button">›</button>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value, name) => [`${Math.round(value * 100)}%`, name]}
          />
          
          <Line type="monotone" dataKey="joy" name="Happy" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="sadness" name="Down" stroke="#2196F3" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="fear" name="Worried" stroke="#FF9800" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="anger" name="Frustrated" stroke="#F44336" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="disgust" name="Annoyed" stroke="#9C27B0" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodLineChart;