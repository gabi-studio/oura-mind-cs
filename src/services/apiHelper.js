//---------------------------------------
// /services/apiHelper.js
//
// Shared API utilities for handling responses.
//
// Exports:
//   - handleResponse(response): checks .ok, parses errors, returns JSON.
//---------------------------------------

//----------------------------------------
// handleResponse
// Generic helper for processing fetch() responses.
// Throws a helpful Error if response is not OK.
// Tries to parse JSON body for a server error message.
// Falls back to raw text if JSON parsing fails.
// Returns parsed JSON if successful.

// --- Fetch response object
// --- Returns parsed JSON data
//----------------------------------------

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    let error = {};
    try {
      error = JSON.parse(text);
    } catch {
      // If parsing fails, keep text
    }
    throw new Error(error.error || `HTTP ${response.status}: ${text}`);
  }

  return response.json();
}


export { 
    handleResponse 
};