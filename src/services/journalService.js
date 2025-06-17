//---------------------------------------
// /services/journalService.js
//
// This file provides reusable helper functions to interact with the server Journal API
// Each function:
// --- Uses fetch() with credentials included
// --- Handles common errors
// --- Returns JSON data when successful
// Functions included:
//   - getJournalEntries()
//   - getDashboardData()
//   - getAdminSummary()
//   - createJournalEntry()
//   - getJournalEntry()
//   - updateJournalEntry()
//   - deleteJournalEntry()
//---------------------------------------

// Base API URL from the .env file
const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;


//---------------------------------------
// handleResponse helper
// For general response checking, error parsing, JSON parsing
// Used by all API functions below
//---------------------------------------
async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    let error = {};
    try {
      error = JSON.parse(text);
    } catch {
      // If not JSON, ignore
    }
    // Fallback message if JSON parsing fails
    throw new Error(error.error || `HTTP ${response.status}: ${text}`);
  }

  // If OK, return JSON body
  return response.json();
}


//----------------------------------------
// Get all journal entries for current user
// GET /journal
//----------------------------------------
async function getJournalEntries() {
  const response = await fetch(`${API_BASE}/journal`, {
    credentials: 'include',
  });

  // handleResponse will throw an error if the response is not OK
  return handleResponse(response);
}


//---------------------------------------
// Get dashboard data (journal entries + summary)
// GET /dashboard
//---------------------------------------
async function getDashboardData() {
  const response = await fetch(`${API_BASE}/dashboard`, {
    credentials: 'include',
  });

  return handleResponse(response);

  // if (!response.ok) {
  //   const error = await response.json().catch(() => ({}));
  //   throw new Error(error.error || 'Failed to fetch dashboard data');
  // }

  // return response.json();
}

//---------------------------------------
// Get admin-only dashboard summary
// GET /dashboard/admin/summary
//---------------------------------------

async function getAdminSummary() {
  const response = await fetch(`${API_BASE}/dashboard/admin/summary`, {
    credentials: 'include',
  });

  return handleResponse(response);
}

//---------------------------------------
// Create a new journal entry
// POST /journal
// Takes: text content
// Returns: new entry object on success
//---------------------------------------
async function createJournalEntry(content) {
  console.log('Making request to create journal entry...');
  
  const response = await fetch(`${API_BASE}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content })
  });

  // console.log('Create entry response status:', response.status);

  return handleResponse(response);
}

//---------------------------------------
// Get a single journal entry by ID
// GET /journal/:id
// Returns: entry data on success
//---------------------------------------
async function getJournalEntry(entryId) {
  // console.log('Fetching journal entry:', entryId);
  
  const response = await fetch(`${API_BASE}/journal/${entryId}`, {
    credentials: 'include',
  });

  return handleResponse(response);

  // console.log('Entry response status:', response.status);

  // If the response does not work:
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   // console.error('Entry fetch error:', errorText);
    
  //   // If the user is not authenticated, prompt them to log in again
  //   if (response.status === 401) {
  //     throw new Error('Not authenticated - please log in again');
  //   }
    
  //   if (response.status === 404) {
  //     throw new Error('Journal entry not found');
  //   }
    
  //   const error = JSON.parse(errorText || '{}');
  //   throw new Error(error.error || `HTTP ${response.status}: Failed to fetch journal entry`);
  // }

  // // If the response is successful, parse and return the entry data
  // const data = await response.json();
  // console.log('Entry fetched successfully:', data);
  // return data;
}

//---------------------------------------
// Update an existing journal entry
// PUT /journal/:id
// Takes: entryId + new content
// Returns: updated entry object
//---------------------------------------
async function updateJournalEntry(entryId, content) {
  console.log('Updating journal entry:', entryId);
  
  const response = await fetch(`${API_BASE}/journal/${entryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content })
  });

  console.log('Update response status:', response.status);

  return handleResponse(response);
}

//---------------------------------------
// Delete a journal entry by ID
// DELETE /journal/:id
// Returns: message of confirmation from server
//---------------------------------------
async function deleteJournalEntry(entryId) {
  console.log('Deleting journal entry:', entryId);
  
  const response = await fetch(`${API_BASE}/journal/${entryId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  console.log('Delete response status:', response.status);

  return handleResponse(response);
}



export {
  getJournalEntries,
  getDashboardData,
  getAdminSummary,
  createJournalEntry,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
};