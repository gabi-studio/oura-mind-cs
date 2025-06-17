import { useState, useEffect } from 'react';
import './CalendarFilter.css';

function CalendarFilter({ entries, onDateRangeChange, selectedStartDate, selectedEndDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState('single'); // 'single', 'range', 'multiple'
  const [selectedDates, setSelectedDates] = useState([]);
  const [rangeStart, setRangeStart] = useState(selectedStartDate ? new Date(selectedStartDate) : null);
  const [rangeEnd, setRangeEnd] = useState(selectedEndDate ? new Date(selectedEndDate) : null);

  // Get entries grouped by date for visual indicators
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = entry.date; // Assuming format: 'YYYY-MM-DD'
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleDateClick = (date) => {
    const dateStr = formatDateForComparison(date);
    
    if (selectionMode === 'single') {
      setSelectedDates([dateStr]);
      onDateRangeChange({
        mode: 'single',
        date: dateStr,
        startDate: dateStr,
        endDate: dateStr
      });
    } else if (selectionMode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start new range
        setRangeStart(date);
        setRangeEnd(null);
        setSelectedDates([dateStr]);
      } else if (rangeStart && !rangeEnd) {
        // Complete range
        const start = rangeStart;
        const end = date;
        
        if (end < start) {
          setRangeStart(end);
          setRangeEnd(start);
          onDateRangeChange({
            mode: 'range',
            startDate: formatDateForComparison(end),
            endDate: formatDateForComparison(start)
          });
        } else {
          setRangeEnd(end);
          onDateRangeChange({
            mode: 'range',
            startDate: formatDateForComparison(start),
            endDate: formatDateForComparison(end)
          });
        }
      }
    } else if (selectionMode === 'multiple') {
      setSelectedDates(prev => 
        prev.includes(dateStr)
          ? prev.filter(d => d !== dateStr)
          : [...prev, dateStr]
      );
    }
  };

  const clearSelection = () => {
    setSelectedDates([]);
    setRangeStart(null);
    setRangeEnd(null);
    onDateRangeChange({
      mode: 'all'
    });
  };

  const isDateSelected = (date) => {
    const dateStr = formatDateForComparison(date);
    
    if (selectionMode === 'single' || selectionMode === 'multiple') {
      return selectedDates.includes(dateStr);
    } else if (selectionMode === 'range') {
      if (rangeStart && rangeEnd) {
        return date >= rangeStart && date <= rangeEnd;
      } else if (rangeStart) {
        return formatDateForComparison(date) === formatDateForComparison(rangeStart);
      }
    }
    
    return false;
  };

  const isDateInRange = (date) => {
    if (selectionMode === 'range' && rangeStart && rangeEnd) {
      return date > rangeStart && date < rangeEnd;
    }
    return false;
  };

  const hasEntries = (date) => {
    const dateStr = formatDateForComparison(date);
    return entriesByDate[dateStr] && entriesByDate[dateStr].length > 0;
  };

  const getEntryCount = (date) => {
    const dateStr = formatDateForComparison(date);
    return entriesByDate[dateStr]?.length || 0;
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDateForComparison(date) === formatDateForComparison(today);
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-filter">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button 
            onClick={() => navigateMonth(-1)} 
            className="nav-btn"
          >
            ‹
          </button>
          <h3 className="month-year">{monthYear}</h3>
          <button 
            onClick={() => navigateMonth(1)} 
            className="nav-btn"
          >
            ›
          </button>
        </div>
        
        <div className="selection-mode">
          <label>
            <input
              type="radio"
              value="single"
              checked={selectionMode === 'single'}
              onChange={(e) => setSelectionMode(e.target.value)}
            />
            Single Date
          </label>
          <label>
            <input
              type="radio"
              value="range"
              checked={selectionMode === 'range'}
              onChange={(e) => setSelectionMode(e.target.value)}
            />
            Date Range
          </label>
        </div>
        
        <button onClick={clearSelection} className="clear-btn">
          Clear Selection
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekday-headers">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="empty-day"></div>;
            }
            
            const selected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const hasEntry = hasEntries(date);
            const entryCount = getEntryCount(date);
            const today = isToday(date);
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`calendar-day ${selected ? 'selected' : ''} ${inRange ? 'in-range' : ''} ${hasEntry ? 'has-entries' : ''} ${today ? 'today' : ''}`}
                title={`${date.toDateString()}${hasEntry ? ` - ${entryCount} entries` : ''}`}
              >
                <span className="day-number">{date.getDate()}</span>
                {hasEntry && (
                  <span className="entry-indicator">
                    {entryCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {(selectedDates.length > 0 || rangeStart) && (
        <div className="selection-summary">
          {selectionMode === 'single' && selectedDates.length > 0 && (
            <p>Selected: {new Date(selectedDates[0]).toLocaleDateString()}</p>
          )}
          {selectionMode === 'range' && rangeStart && rangeEnd && (
            <p>
              Range: {rangeStart.toLocaleDateString()} - {rangeEnd.toLocaleDateString()}
            </p>
          )}
          {selectionMode === 'range' && rangeStart && !rangeEnd && (
            <p>Start: {rangeStart.toLocaleDateString()} (select end date)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarFilter;