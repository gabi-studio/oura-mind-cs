//---------------------------------------
// /pages/ReflectorDashboard.jsx
// This page displays the Reflector Dashboard for Reflector users
// It shows journal entries, allows navigation between weeks, and provides access to entry management
// It uses the WeeklyNav component for week navigation
// Uses JournalService for fetching journal entries
//------------------------------------------

import { useState, useEffect } from 'react';
import { getJournalEntries } from '../services/journalService';
import '../styles/Dashboard.css';
import { formatDateSafe } from '../utils/date';
import WeeklyNav from '../components/WeeklyNav/WeeklyNav';
import { ToastContainer, toast } from 'react-toastify';
import LoadingSpinner from '../components/Reusables/LoadingSpinner/LoadingSpinner';
import SimpleStats from '../components/SimpleStats/SimpleStats';

// Base API URL from .env
const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;


// ReflectorDashboard component

function ReflectorDashboard() {
  // List of Journal entries for the Reflector user, fetched from the server
  // It includes loading state, error handling, and view management
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  

  
// Load initial dashboard data when the component is mounted
  useEffect(() => {
    loadDashboardData();
  }, []);


  //-------------------------------
  // loadDashboardData function
  // This function fetches journal entries from the server and processes them
  // It cleans up the date format then sets the entries state
  //--------------------------------
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch journal entries from the server using JournalService
      // GetJournalEntries fetches entries from the API
      const data = await getJournalEntries();
    //   console.log('[DEBUG] Raw entries:', data.entries);
      
    // If the API returns an object with entries, use that
    // otherwise, assuming it's an empty array because no entries exist
      const entriesArray = data.entries || data || [];
      
      // Cleaning up the date format stored in the database
      // Stored dates are in the format '2025-06-12, 9:26:27 a.m.'
      const cleanedEntries = entriesArray.map(entry => ({
        ...entry,
        date: entry.date.split(',')[0] // '2025-06-12, 9:26:27 a.m.' becomes '2025-06-12'
      }));
      
    //   console.log('[DEBUG] Cleaned entries:', cleanedEntries);
      setEntries(cleanedEntries);
      
    //   Display message if no entries are found
    } catch (err) {
      setError(err.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };


    //--------------------------------
    // Function to handle delete for a journal entry
    // TO DO: Create a JournalService function to handle deletion and move this into services
    // Makes a DELETE request to the API to remove the Journal entry by entry id
    // If successful, reloads the dashboard data
    // If it fails, shows an alert with the error message
    //--------------------------------
    const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      setLoading(true); 
      await fetch(`${API_BASE}/journal/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      await loadDashboardData(); 
    } catch (err) {
      toast.error('Failed to delete entry: ' + err.message);
    } finally {
      setLoading(false);
    }
  };




  //--------------------------------
  // Helper function to get start of week (Monday)
  // Reference: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-50.php#:~:text=The%20function%20%22startOfWeek()%22%20takes,getDay()').
  //--------------------------------
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d);
    weekStart.setDate(diff);
    return weekStart;
  }

  //--------------------------------
  // Helper function to convert date to YYYY-MM-DD format
  //--------------------------------

  function dateToString(date) {
    return date.toISOString().split('T')[0];
  }


  //--------------------------------
  // Helper function to is check if two dates are the same day
  // Needs two dates (dateA and dateB) and compares them
  // Returns true if they are the same day, false otherwise
  // Used in WeeklyNav to determine if a date is selected or if current date
  //---------------------------------
  function isSameDay(dateA, dateB) {
    if (!dateA || !dateB) return false;
    
    let dateAStr, dateBStr;
    
    // If the dates are strings, use them directly
    // Otherwise, convert them to string format
    // This is to ensure that the date comparison is comparing the dates in the same format
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

  //--------------------------------
  // Helper function to get week days
  // Takes a week start date and returns an array 7 dates, starting from that date
  // This is used to display the week in the WeeklyNav component
  //--------------------------------
  
  
  function getWeekDays(weekStart) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      // Create a new date object for each day of the week
      const day = new Date(weekStart);
      // New date object is set to the start of the week
      // Offsetting the date by i days
      // This way, there will be 7 days in the week
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }

    // Return an array of Date objects representing the week days
    return days;
  }

  //--------------------------------
  // Helper function to get entries for a specific date
  // It takes a date object, converts it to string format (YYYY-MM-DD)
  // and filters the entries array to find all entries that match that date
  //--------------------------------
  function getEntriesForDate(date) {
    const targetDateStr = dateToString(date);
    // console.log('[DEBUG] Looking for entries on:', targetDateStr);
    const foundEntries = entries.filter(entry => {
      // console.log('[DEBUG] Comparing', entry.date, 'with', targetDateStr);
      return entry.date === targetDateStr;
    });
    // console.log('[DEBUG] Found entries:', foundEntries);
    return foundEntries;
  }

  //--------------------------------
  // Helper function to get entries for current view
  // If current view is 'day', it returns entries for selected date
  // Otherwise assumes the current view is 'week', and returns entries for the entire week
  // It sorts the entries by date in descending order
  // This is used to display the entries in the dashboard
  //--------------------------------
  function getDisplayEntries() {
    if (currentView === 'day') {
      return getEntriesForDate(selectedDate);
    } else {
      const weekDays = getWeekDays(currentWeekStart);
      
      // Initialize an array to hold all entries for the week
      // This will hold individual Journal entries for the entire week
      const weekEntries = [];

      // Loop through each day of the week
      // Get entries for that day and add them to the weekEntries array
      // Return sorted entries by date in descending order
      weekDays.forEach(day => {
        const dayEntries = getEntriesForDate(day);
        weekEntries.push(...dayEntries);
      });
      return weekEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  //--------------------------------
  // Helper function to format content date
  // It formats the date string based on the current view (day or week)
  // Using formatDateSafe and dateToString 
  //---------------------------------

  const formatContentDate = () => {
    // If current view is 'day', format the selected date using dateToString
    if (currentView === 'day') {
      const dateString = dateToString(selectedDate);
      return formatDateSafe(dateString);
    } else {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);

      // Firt converting the dates to string format using dateToString
      // Then formatting them using formatDateSafe
      const weekStartString = dateToString(currentWeekStart);
      const weekEndString = dateToString(weekEnd);

      return `${formatDateSafe(weekStartString)} - ${formatDateSafe(weekEndString)}`;


    // TODO for later: make a smaller date format using this:
    //   return `${currentWeekStart.toLocaleDateString('en-CA', {
    //     month: 'short',
    //     day: 'numeric',
    //     timeZone: 'America/Toronto'
    //   })} - ${weekEnd.toLocaleDateString('en-CA', {
    //     month: 'short',
    //     day: 'numeric',
    //     timeZone: 'America/Toronto'
    //   })}`;
    

    }
  };

  //--------------------------------
  // Function to navigate between weeks
  // It takes a direction parameter (-1 for previous week, 1 for next week)
  // It calculates the new week start date based on the current week start date
  
  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    // Set the new week start date by adding or subtracting 7 days
    newWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newWeekStart);
  };

  //--------------------------------
  // Function to select a specific day
  // Use: If Reflector user clicks on a day in the WeeklyNav component
  // It sets the selected date to the clicked day and changes the current view to 'day'
  //--------------------------------
  const selectDay = (date) => {
    setSelectedDate(new Date(date));
    setCurrentView('day');
  };

  //--------------------------------
  // Render the dashboard
  // If loading, show a loading spinner + message
  //-----------------------------------
  if (loading) {
    return (
      <div>
        <LoadingSpinner text="Loading your dashboard..." />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // If there was an error loading the dashboard, show an error message
  // and a retry button to reload the dashboard data
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
  
  // Using SimpleStats component to display stats
  // It takes an array of stats objects with value and label properties
  // This will be used to display the stats in the dashboard
  const stats = [
  { value: todaysEntries.length, label: 'Today' },
  { value: displayEntries.length, label: `This ${currentView}` },
  { value: entries.length, label: 'Total' },
];


  return (
    <div className="dashboard-container">
      
      {/* Simple Stats */}


      <h1 className="simple-stats-title">Your Journal Stats</h1>

      <SimpleStats stats={stats} />

      

      {/* View Controls 
      --- Simple toggle between day and week view
      --- clicking buttons sets the state to the corresponding view */}
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

        {/* Weekly Dots / Weekly Nav
        --- Using WeeklyNav component to display the weekly navigation
        --- It takes the week start date, navigation handlers, and other props */}

        <WeeklyNav
            weekStart={currentWeekStart}
            onPrev={() => navigateWeek(-1)}
            onNext={() => navigateWeek(1)}
            weekDays={weekDays}
            getEntriesForDate={getEntriesForDate}
            isSameDay={isSameDay}
            currentView={currentView}
            selectedDate={selectedDate}
            dateToString={dateToString}
            formatDateSafe={formatDateSafe}
            selectDay={selectDay}
        />

      {/* Content */}
      <div className="dashboard-content">

        {/* Content Header */}
        <div className="content-header">
          <h2 className="content-title">
            {currentView === 'day' ? 'Daily Entries' : 'Weekly Entries'}
          </h2>
          <span className="content-date">{formatContentDate()}</span>
        </div>

        {/* Content Body ---
        --- Write new entry button,
        --- TO DO: Use List Item component for entries */}
        <div className="content-body">

            {/* If there are no entries for the selected view ---
            --- show a message and a link to create a new entry */}
          {displayEntries.length === 0 ? (
            <div className="empty-state-simple">
              <p>No entries for this {currentView}.</p>
              <a href="/journal/new" className="empty-state-link-simple">
                Write your first entry today
              </a>
            </div>
          ) : (
            // If there are entries, display them in a list
            // Each entry has a header with date and actions (view, edit, delete)
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

                  {/* Entry Preview --- Display less than 150 characters */}
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