import { useState, useEffect } from 'react';
import './MoodGrid.css';

function MoodGrid() {
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
      // Only use days that actually have data
      const validData = (result.trends || []).filter(day => {
        const hasData = day.joy || day.sadness || day.fear || day.anger || day.disgust;
        return hasData;
      });
      setData(validData);
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

  const getDominantMood = (day) => {
    const emotions = {
      joy: day.joy || 0,
      sadness: day.sadness || 0,
      fear: day.fear || 0,
      anger: day.anger || 0,
      disgust: day.disgust || 0
    };

    const highest = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[0]] ? a : b);
    return highest[0];
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      joy: '😊',
      sadness: '😢',
      fear: '😨',
      anger: '😠',
      disgust: '😤'
    };
    return emojis[mood] || '😐';
  };

  const getMoodLabel = (mood) => {
    const labels = {
      joy: 'Happy',
      sadness: 'Down', 
      fear: 'Worried',
      anger: 'Frustrated',
      disgust: 'Annoyed'
    };
    return labels[mood] || mood;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (data.length === 0) return <div className="no-data">No mood data available for {getMonthLabel()}</div>;

  return (
    <div className="grid-container">
      <div className="grid-header">
        <button onClick={() => navigateMonth(-1)} className="nav-button">‹</button>
        <h3 className="grid-title">Mood Grid - {getMonthLabel()}</h3>
        <button onClick={() => navigateMonth(1)} className="nav-button">›</button>
      </div>
      
      <div className="mood-grid">
        {data.map((day, index) => {
          const dominantMood = getDominantMood(day);
        //   const moodEmoji = getMoodEmoji(dominantMood);
          const dayOfMonth = new Date(day.date).getDate();
          
          return (
            <div
              key={index}
              className={`mood-box mood-${dominantMood}`}
              title={`${new Date(day.date).toLocaleDateString()}: ${getMoodLabel(dominantMood)}`}
            >
              <div className="day-number">{dayOfMonth}</div>
              {/* <div className="mood-emoji">{moodEmoji}</div> */}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <span className="legend-item">
          <div className="legend-color joy"></div>
          Happy
        </span>
        <span className="legend-item">
          <div className="legend-color sadness"></div>
          Down
        </span>
        <span className="legend-item">
          <div className="legend-color fear"></div>
          Worried
        </span>
        <span className="legend-item">
          <div className="legend-color anger"></div>
          Frustrated
        </span>
        <span className="legend-item">
          <div className="legend-color disgust"></div>
          Annoyed
        </span>
      </div>
    </div>
  );
}

export default MoodGrid;