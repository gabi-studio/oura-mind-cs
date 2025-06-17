//---------------------------------------
// /pages/MyJournalsPage.jsx
// This page displays all journal entries with comprehensive filtering and search capabilities
// It allows users to search through entries, filter by date ranges, sort entries, and manage them
// Uses CalendarFilter component for date filtering and provides full CRUD operations
// Uses JournalService for fetching and managing journal entries
//------------------------------------------

import { useState, useEffect } from 'react';
import { getJournalEntries } from '../services/journalService';
import CalendarFilter from '../components/CalendarFilter/CalendarFilter';
import './MyJournalsPage.css';
import { formatDateSafe } from '../utils/date';

// Base API URL from .env
const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;


function MyJournalsPage() {
  //--------------------------------
  // State Management
  //--------------------------------
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  //--------------------------------
  // Filter State Management
  // Comprehensive filtering system supporting:
  // - Text search through entry content
  // - Date filtering (all, single date, date range)
  // - Sorting by newest/oldest entries
  //--------------------------------
  const [filters, setFilters] = useState({
    searchQuery: '', // Search through entry text content
    dateFilter: {
      mode: 'all', // 'all', 'single', 'range' - determines date filter type
      date: null, // Single date selection
      startDate: null, // Range start date
      endDate: null // Range end date
    },
    sortBy: 'newest' 
  });

  // Calendar visibility toggle for date filtering UI
  const [showCalendar, setShowCalendar] = useState(false);

  //--------------------------------
  // Effect Hooks
  // Load initial data on component mount
  // Apply filters whenever entries or filter criteria change
  //--------------------------------
  useEffect(() => {
    loadJournalEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, filters]);

  //-------------------------------
  // loadJournalEntries function
  // Fetches all journal entries from the server and processes them for display
  // Cleans up date format from server response (removes time portion)
  // Handles loading states and error conditions
  // Similar to ReflectorDashboard's loadDashboardData but focused on complete entry list
  //--------------------------------
  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch journal entries from the server using JournalService
      // getJournalEntries handles the API call and authentication
      const data = await getJournalEntries();
      
      // API response flexibility: handle both object.entries and direct array formats
      // For compatibility with different API response structures
      const entriesArray = data.entries || data || [];
      
      //--------------------------------
      // Date Format Cleanup
      // Server stores dates as '2025-06-12, 9:26:27 a.m.' format
      // We need only the date portion '2025-06-12' for filtering and display
      // This standardization enables proper date comparisons and filtering
      //--------------------------------
      const cleanedEntries = entriesArray.map(entry => ({
        ...entry,
        date: entry.date.split(',')[0] // Extract date portion only
      }));
      
      setEntries(cleanedEntries);
      
    } catch (err) {
    
      setError(err.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  //--------------------------------
  // applyFilters function
  // Filters entries through multiple criteria:
  // --- Text search filtering through entry content
  // --- Date-based filtering (single date or date range)
  // --- Sorting by date (newest or oldest first)
  // This function is called whenever entries or filter criteria change
  //--------------------------------
  const applyFilters = () => {
    // Start with a copy of all entries to avoid mutating original data
    let filtered = [...entries];

    //--------------------------------
    // Text Search Filtering
    // Case-insensitive search through entry text content
    // Trims whitespace and handles empty/null text 
    //--------------------------------
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(entry => 
        entry.text && entry.text.toLowerCase().includes(query)
      );
    }

    //--------------------------------
    // Date-based Filtering
    // Supports three modes:
    // - 'all': Show all entries (no date filtering)
    // - 'single': Show entries from specific date only
    // - 'range': Show entries within start and end date range (inclusive)
    //--------------------------------
    if (filters.dateFilter.mode !== 'all') {
      if (filters.dateFilter.mode === 'single' && filters.dateFilter.date) {
        // Single date filtering: exact date match
        filtered = filtered.filter(entry => entry.date === filters.dateFilter.date);
      } else if (filters.dateFilter.mode === 'range' && filters.dateFilter.startDate && filters.dateFilter.endDate) {
        // Date range filtering: inclusive range check
        filtered = filtered.filter(entry => 
          entry.date >= filters.dateFilter.startDate && 
          entry.date <= filters.dateFilter.endDate
        );
      }
    }

    //--------------------------------
    // Sorting Logic
    // Sort by date using Date object comparison
    // 'newest': Most recent entries first (descending)
    // 'oldest': Oldest entries first (ascending)
    //--------------------------------
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Update filtered entries state to trigger UI re-render
    setFilteredEntries(filtered);
  };

  //--------------------------------
  // Date Filter Handler
  // Receives date filter configuration from CalendarFilter component
  // Updates the dateFilter portion of filters state
  //--------------------------------
  const handleDateRangeChange = (dateFilter) => {
    setFilters(prev => ({
      ...prev,
      dateFilter
    }));
  };

  //--------------------------------
  // Generic Filter Change Handler
  // Handles updates to any filter property (sortBy, etc.)
  //--------------------------------
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  //--------------------------------
  // Search Input Handler
  // Updates search query from input field changes
  //--------------------------------
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value
    }));
  };

  //--------------------------------
  // Clear All Filters Handler
  // Resets all filter criteria to default values
  // Restores initial state showing all entries sorted by newest
  //--------------------------------
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      dateFilter: {
        mode: 'all',
        date: null,
        startDate: null,
        endDate: null
      },
      sortBy: 'newest'
    });
  };

  //--------------------------------
  // handleDelete function
  // Handles journal entry deletion with user confirmation
  // Makes DELETE request to API 
  // Provides error handling and user feedback
  // TODO: Move this to JournalService for better code organization
  // Similar to ReflectorDashboard's handleDelete
  //--------------------------------
  const handleDelete = async (entryId) => {
    // User confirmation dialog to prevent accidental deletions
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Make DELETE request to API endpoint
      // Uses credentials: 'include' for authentication cookies
      const response = await fetch(`${API_BASE}/journal/${entryId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete entry: ${response.statusText}`);
      }

      // Reload all entries to ensure UI consistency
      // Alternative: Remove entry from local state for better UX
      await loadJournalEntries();
      
      console.log('Entry deleted successfully:', entryId);
      
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //--------------------------------
  // Date Filter Summary Helper
  // Generates human-readable description of current date filter
  // Used in calendar toggle button to show active filter state
  // Handles different filter modes with appropriate formatting
  //--------------------------------
  const getDateFilterSummary = () => {
    if (filters.dateFilter.mode === 'single' && filters.dateFilter.date) {
      return `Date: ${new Date(filters.dateFilter.date).toLocaleDateString()}`;
    } else if (filters.dateFilter.mode === 'range' && filters.dateFilter.startDate && filters.dateFilter.endDate) {
      return `Date Range: ${new Date(filters.dateFilter.startDate).toLocaleDateString()} - ${new Date(filters.dateFilter.endDate).toLocaleDateString()}`;
    }
    return 'All Dates';
  };

  //--------------------------------
  // Search Term Highlighting Helper
  // Creates highlighted text by wrapping search matches in <mark> elements
  // Uses regex to find all occurrences of search term (case-insensitive)
  // Escapes special regex characters in search term for safety

  //--------------------------------
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    // Escape special regex characters in search term
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    // Map text parts, highlighting matches with <mark> elements
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="search-highlight">{part}</mark> : 
        part
    );
  };

  //--------------------------------
  // Loading State Rendering
  // Shows loading message while fetching journal entries
  // Provides user feedback during API calls
  //--------------------------------
  if (loading) {
    return (
      <div className="my-journals-loading">
        <p>Loading your journals...</p>
      </div>
    );
  }

  //--------------------------------
  // Error State Rendering
  // Displays error message with retry functionality
  // Allows users to attempt reloading if initial fetch failed
  //--------------------------------
  if (error) {
    return (
      <div className="my-journals-error">
        <p>Error loading journals: {error}</p>
        <button onClick={loadJournalEntries} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  //--------------------------------
  // Main Component Rendering
  // Renders the complete MyJournals interface with:
  // - Header with title and new journal link
  // - Comprehensive filtering controls
  // - Results summary
  // - Journal entries list with actions
  //--------------------------------
  return (
    <div className="my-journals-container">
      
      {/* Page Header */}
      <div className="my-journals-header">
        <h1 className="my-journals-title">My Journals</h1>
        <a href="/journal/new" className="new-journal-btn">Write New Journal</a>
      </div>

      {/* Comprehensive Filtering Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filters</h3>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All
          </button>
        </div>

        <div className="filters-grid">
          
          {/* Text Search Filter */}
          <div className="filter-group">
            <label className="filter-label">Search Entries</label>
            <div className="search-input-container">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search through your journal entries..."
                className="search-input"
              />
              {/* Clear search button - only shown when search is active */}
              {filters.searchQuery && (
                <button 
                  onClick={() => handleSearchChange({ target: { value: '' } })}
                  className="clear-search-btn"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Date Filter with Calendar Integration */}
          <div className="filter-group">
            <label className="filter-label">Date Filter</label>
            <div className="date-filter-controls">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="calendar-toggle-btn"
              >
                 {getDateFilterSummary()}
              </button>
            </div>
            
            {/* Calendar Filter Component - conditionally rendered */}
            {showCalendar && (
              <div className="calendar-container">
                <CalendarFilter
                  entries={entries}
                  onDateRangeChange={handleDateRangeChange}
                  selectedStartDate={filters.dateFilter.startDate}
                  selectedEndDate={filters.dateFilter.endDate}
                />
              </div>
            )}
          </div>

          {/* Sort Order Selection */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary Section */}
      <div className="results-summary">
        <p>Showing {filteredEntries.length} of {entries.length} entries</p>
        {/* Active search indicator */}
        {filters.searchQuery && (
          <p className="active-filters">
            Searching for: "{filters.searchQuery}"
          </p>
        )}
      </div>

      {/* Journal Entries List */}
      <div className="journals-list">
        {filteredEntries.length === 0 ? (
          
          /* Empty State Handling */
          <div className="empty-state">
            {filters.searchQuery ? (
              /* No search results state */
              <>
                <p>No journals found matching "{filters.searchQuery}".</p>
                <button onClick={() => handleSearchChange({ target: { value: '' } })} className="clear-filters-link">
                  Clear search
                </button>
              </>
            ) : (
              /* No entries matching filters state */
              <>
                <p>No journals found matching your filters.</p>
                <button onClick={clearFilters} className="clear-filters-link">
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : (
          
          /* Journal Entries Display */
          filteredEntries.map(entry => (
            <div key={entry.id} className="journal-card">
              
              {/* Entry Header with Date and Actions */}
              <div className="journal-card-header">
                <div className="journal-date">
                  {formatDateSafe(entry.date)}
                </div>
                
                {/* Entry Management Actions */}
                <div className="journal-actions">
                  <a href={`/journal/${entry.id}`} className="action-btn action-btn-primary">
                    View
                  </a>
                  <a href={`/journal/${entry.id}/edit`} className="action-btn action-btn-secondary">
                    Edit
                  </a>
                  <button 
                    onClick={() => handleDelete(entry.id)} 
                    className="action-btn action-btn-secondary"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Entry Content Preview */}
              <div className="journal-content">
                <p className="journal-preview">
                  {/* Conditional highlighting based on active search */}
                  {filters.searchQuery ? (
                    highlightSearchTerm(
                      (entry.text || 'No content available').substring(0, 200),
                      filters.searchQuery
                    )
                  ) : (
                    (entry.text || 'No content available').substring(0, 200)
                  )}
                  {/* Truncation indicator */}
                  {entry.text && entry.text.length > 200 ? '...' : ''}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyJournalsPage;