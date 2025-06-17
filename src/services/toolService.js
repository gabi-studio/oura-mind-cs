//---------------------------------------
// /services/toolService.js
//
// This file provides reusable helper functions to interact with the Reflection Tools API on the server
// Each function:
// --- Uses fetch() with credentials included
// --- Uses handleResponse() for consistent response + error handling
// --- Returns parsed JSON when successful
//
// Functions included:
//   - fetchToolForm()
//   - submitToolForm()
//   - fetchToolFormForEdit()
//   - updateToolForm()
//   - deleteToolSubmission()
//   - fetchToolForView()
//---------------------------------------


// Get the API base URL from .env
const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;

//---------------------------------------
// handleResponse helper
//
// Shared helper for all API calls
// Checks response.ok, parses errors if needed,
// returns JSON if successful
//---------------------------------------
async function handleResponse(response) {
  if (!response.ok) {
    // Read raw response text
    const text = await response.text();
    let error = {};
    try {
      // Try to parse JSON, if it fails, use raw text
      error = JSON.parse(text);
    } catch {
      // If parsing fails, use raw text and error message
    }

    throw new Error(error.error || `HTTP ${response.status}: ${text}`);
  }

  // If response is OK, parse and return JSON
  return response.json();
}


//---------------------------------------
// fetchToolForm
// GET /tools/:path/form/:entryId
// Fetches data + prompts for a new tool form submission for a specific journal entry.
async function fetchToolForm(path, entryId) {
  // console.log('[FETCH TOOL FORM]', `${API_BASE}/tools/${path}/form/${entryId}`);
  
  const response = await fetch(`${API_BASE}/tools/${path}/form/${entryId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return handleResponse(response);
}

//---------------------------------------
// submitToolForm
// POST /tools/:path/submit/:entryId
// Sends new answers + mood ratings for a reflection tool
//---------------------------------------
async function submitToolForm(path, entryId, answers, moods) {
  const response = await fetch(`${API_BASE}/tools/${path}/submit/${entryId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ answers, moods }),
  });

  return handleResponse(response);
}

//---------------------------------------
// fetchToolFormForEdit
// GET /tools/:path/edit/:entryId
// Fetches existing answers + moods for editing
// If edit fails (not found), fallback to fresh form
// Normalizes keys for consistency on frontend
//---------------------------------------

async function fetchToolFormForEdit(path, entryId) {
  // console.log('[FETCH TOOL FORM FOR EDIT]', `${API_BASE}/tools/${path}/edit/${entryId}`);

  const response = await fetch(`${API_BASE}/tools/${path}/edit/${entryId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    
    return fetchToolForm(path, entryId);
  }

  const data = await response.json();
  
  
  // Transform the response to match frontend expectations
  const transformedData = {
    ...data,
    // Map responseMap to answers 
    answers: data.responseMap || data.answers || {},
    // Map moodMap to moodRatings
    moodRatings: data.moodMap || data.moodRatings || {}
  };
  
  // console.log('[FETCH TOOL FORM FOR EDIT] Transformed response:', transformedData);
  return transformedData;
}

//---------------------------------------
// updateToolForm
// POST /tools/:path/update/:entryId
// Updates existing answers + moods for a reflection tool
//---------------------------------------
async function updateToolForm(path, entryId, answers, moods) {
  const response = await fetch(`${API_BASE}/tools/${path}/update/${entryId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ answers, moods }),
  });

  return handleResponse(response);
}

//---------------------------------------
// deleteToolSubmission
// DELETE /tools/:path/delete/:entryId
// Deletes a saved reflection submission for a tool
//---------------------------------------
async function deleteToolSubmission(path, entryId) {
  const response = await fetch(`${API_BASE}/tools/${path}/delete/${entryId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  return handleResponse(response);
}

//---------------------------------------
// fetchToolForView
// GET /tools/:path/view/:entryId
// Fetches a reflection submission in read-only mode
//---------------------------------------
async function fetchToolForView(path, entryId) {
  const response = await fetch(`${API_BASE}/tools/${path}/view/${entryId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return handleResponse(response);
}



export {
  fetchToolForm,            // For new submission
  submitToolForm,           // For submitting answers
  fetchToolFormForEdit,     // For editing submission
  updateToolForm,           // For updating answers
  deleteToolSubmission,     // For deleting submission
  fetchToolForView,         // For read-only view
};