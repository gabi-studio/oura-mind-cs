//-------------------------------------
// src/components/WeeklyNav.jsx
// This component displays a navigation bar for the weekly view of a journal
// It shows the current week, allows navigation to previous and next weeks,
// and displays dots for each day of the week with entry counts
// Currently used in the Reflector Dashboard page
// References: 
// --- https://stackoverflow.com/questions/72270238/react-js-how-to-properly-use-the-map-function-to-display-data
// --- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
//----------------------------------------

import './WeeklyNav.css';

function WeeklyNav({

// Props for the WeeklyNav component
  weekStart,
  onPrev,
  onNext,
  weekDays,
  getEntriesForDate,
  isSameDay,
  currentView,
  selectedDate,
  dateToString,
  formatDateSafe,
  selectDay
}) {
  return (
    <div className="weekly-nav">
      <div className="weekly-nav-title">

        {/* Arrows for navigating between weeks */}
        <button className="week-nav-arrow" onClick={onPrev}>&larr;</button>

        {/* Current week display */}
        <span>
          {weekStart.toLocaleDateString('en-CA', {
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Toronto'
          })}
        </span>

        {/* Arrows for navigating between weeks */}
        <button className="week-nav-arrow" onClick={onNext}>&rarr;</button>
      </div>

        {/* Dots for each day of the week */}
      <div className="week-dots">

        {/* Loops through each day of the week,
        --- getting the entries for each day
        --- checks if the day is today or selected */}
        {weekDays.map((day, index) => {
          const dayEntries = getEntriesForDate(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = currentView === 'day' && isSameDay(day, selectedDate);
          const dateStr = dateToString(day);

          return (
            <button
        
            // Each day dot is a button
              key={index}
              
              // If there are entries for the day
              // it will have a different class

              className={`day-dot ${dayEntries.length ? 'has-entries' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => selectDay(day)}
              title={`${formatDateSafe(dateStr)} - ${dayEntries.length} entries`}
            >

            {/* Day label ---
            --- Showing abbreviated day, date, and number of entries on that day */}
              <span className="day-label">
                {formatDateSafe(dateStr).split(',')[0].substring(0, 2)}
              </span>
              <span className="day-number">{day.getDate()}</span>
              <span className="entry-count">{dayEntries.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyNav;
