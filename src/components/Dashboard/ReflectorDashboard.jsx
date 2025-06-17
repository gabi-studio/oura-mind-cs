import { useState, useEffect } from 'react';
import { getJournalEntries } from '../../services/journalService';
import './dashboard.css';
import { formatDateSafe } from '../../utils/date';


function ReflectorDashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getJournalEntries();
      console.log('[DEBUG] Raw entries:', data.entries);
      
      const entriesArray = data.entries || data || [];
      
      // Cleaning up the date format stored in the database
      const cleanedEntries = entriesArray.map(entry => ({
        ...entry,
        date: entry.date.split(',')[0] // '2025-06-12, 9:26:27 a.m.' becomes '2025-06-12'
      }));
      
      console.log('[DEBUG] Cleaned entries:', cleanedEntries);
      setEntries(cleanedEntries);
      
    } catch (err) {
      setError(err.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get start of week (Monday)
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d);
    weekStart.setDate(diff);
    return weekStart;
  }

  // Helper function to convert date to YYYY-MM-DD format
  function dateToString(date) {
    return date.toISOString().split('T')[0];
  }

  // Helper function to compare dates
  function isSameDay(dateA, dateB) {
    if (!dateA || !dateB) return false;
    
    let dateAStr, dateBStr;
    
    if (typeof dateA === 'string') {
      dateAStr = dateA;
    } else {
      dateAStr = dateToString(dateA);
    }
    
    if (typeof dateB === 'string') {
      dateBStr = dateB;
    } else {
      dateBStr = dateToString(dateB);
    }
    
    return dateAStr === dateBStr;
  }

  // Helper function to get week days
  function getWeekDays(weekStart) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // Helper function to get entries for a specific date
  function getEntriesForDate(date) {
    const targetDateStr = dateToString(date);
    console.log('[DEBUG] Looking for entries on:', targetDateStr);
    const foundEntries = entries.filter(entry => {
      console.log('[DEBUG] Comparing', entry.date, 'with', targetDateStr);
      return entry.date === targetDateStr;
    });
    console.log('[DEBUG] Found entries:', foundEntries);
    return foundEntries;
  }

  // Helper function to get entries for current view
  function getDisplayEntries() {
    if (currentView === 'day') {
      return getEntriesForDate(selectedDate);
    } else {
      const weekDays = getWeekDays(currentWeekStart);
      const weekEntries = [];
      weekDays.forEach(day => {
        const dayEntries = getEntriesForDate(day);
        weekEntries.push(...dayEntries);
      });
      return weekEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  const formatContentDate = () => {
    if (currentView === 'day') {
      const dateString = dateToString(selectedDate);
      return formatDateSafe(dateString);
    } else {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      return `${currentWeekStart.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        timeZone: 'America/Toronto'
      })} - ${weekEnd.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        timeZone: 'America/Toronto'
      })}`;
    }
  };

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newWeekStart);
  };

  const selectDay = (date) => {
    setSelectedDate(new Date(date));
    setCurrentView('day');
  };

  if (loading) {
    return (
      <div className="loading-simple">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading dashboard: {error}</p>
        <button onClick={loadDashboardData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  const weekDays = getWeekDays(currentWeekStart);
  const displayEntries = getDisplayEntries();
  const todaysEntries = getEntriesForDate(new Date());

  return (
    <div className="dashboard-container">
      {/* Debug Info
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px', fontSize: '12px' }}>
        <strong>Debug:</strong> Total entries: {entries.length}, Today's entries: {todaysEntries.length}, Display entries: {displayEntries.length}
        <br />
        <strong>Today:</strong> {dateToString(new Date())}
      </div> */}

      {/* <div className="mood-trends" style={{ marginBottom: '2rem' }}>
        <MoodTrends />
      </div> */}

      {/* Simple Stats */}
      <div className="simple-stats">
        <div className="simple-stat">
          <p className="simple-stat-number">{todaysEntries.length}</p>
          <p className="simple-stat-label">Today</p>
        </div>
        <div className="simple-stat">
          <p className="simple-stat-number">{displayEntries.length}</p>
          <p className="simple-stat-label">This {currentView}</p>
        </div>
        <div className="simple-stat">
          <p className="simple-stat-number">{entries.length}</p>
          <p className="simple-stat-label">Total</p>
        </div>
      </div>

      {/* View Controls */}
      <div className="view-controls">
        <div className="view-switcher">
          <button 
            className={`view-btn ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => setCurrentView('day')}
          >
            Today
          </button>
          <button 
            className={`view-btn ${currentView === 'week' ? 'active' : ''}`}
            onClick={() => setCurrentView('week')}
          >
            This Week
          </button>
        </div>
        <a href="/journal/new" className="new-entry-btn-simple">Write New Journal</a>
      </div>

      {/* Weekly Dots */}
      <div className="weekly-nav">
        <div className="weekly-nav-title">
          <button className="week-nav-arrow" onClick={() => navigateWeek(-1)}>←</button>
          <span style={{ margin: '0 1rem' }}>
            {currentWeekStart.toLocaleDateString('en-CA', {
              month: 'long',
              year: 'numeric',
              timeZone: 'America/Toronto'
            })}
          </span>
          <button className="week-nav-arrow" onClick={() => navigateWeek(1)}>→</button>
        </div>

        <div className="week-dots">
          {weekDays.map((day, index) => {
            const dayEntries = getEntriesForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = currentView === 'day' && isSameDay(day, selectedDate);
            const dateStr = dateToString(day);

            return (
              <button
                key={index}
                className={`day-dot ${dayEntries.length > 0 ? 'has-entries' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => selectDay(day)}
                title={`${formatDateSafe(dateStr)} - ${dayEntries.length} entries`}
              >
                <span className="day-label">
                  {formatDateSafe(dateStr).split(',')[0].substring(0, 2)}
                </span>
                <span className="day-number">{day.getDate()}</span>
                {dayEntries.length > 0 && <span className="entry-count">{dayEntries.length}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <h2 className="content-title">
            {currentView === 'day' ? 'Daily Entries' : 'Weekly Entries'}
          </h2>
          <span className="content-date">{formatContentDate()}</span>
        </div>

        <div className="content-body">
          {displayEntries.length === 0 ? (
            <div className="empty-state-simple">
              <p>No entries for this {currentView}.</p>
              <a href="/journal/new" className="empty-state-link-simple">
                Write your first entry today
              </a>
            </div>
          ) : (
            <div className="entry-list">
              {displayEntries.map(entry => (
                <div key={entry.id} className="entry-item">
                  <div className="entry-item-header">
                    <span className="entry-time">
                      {formatDateSafe(entry.date)}
                    </span>
                    <div className="entry-actions">
                      <a href={`/journal/${entry.id}`} className="action-btn action-btn-primary">
                        View
                      </a>
                      <a href={`/journal/${entry.id}/edit`} className="action-btn action-btn-secondary">
                        Edit
                      </a>
                      <button 
                        onClick={() => handleDelete(entry.id)} 
                        className="action-btn action-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="entry-preview">
                    {(entry.text || 'No content available').substring(0, 150)}
                    {entry.text && entry.text.length > 150 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReflectorDashboard;