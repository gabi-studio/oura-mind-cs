//---------------------------------------
// /services/adminToolService.js
//
// Admin-only Reflection Tool CRUD operations
//---------------------------------------

import { handleResponse } from './apiHelper';

const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;

// Fetch a single tool by ID
async function fetchTool(toolId) {
  const response = await fetch(`${API_BASE}/admin/tools/${toolId}`, { credentials: 'include' });
  return handleResponse(response);
}

// Fetch prompts for a tool
async function fetchToolPrompts(toolId) {
  const response = await fetch(`${API_BASE}/admin/tools/${toolId}/prompts`, { credentials: 'include' });
  return handleResponse(response);
}

// Fetch linked emotions for a tool
async function fetchToolEmotions(toolId) {
  const response = await fetch(`${API_BASE}/admin/tools/${toolId}/emotions`, { credentials: 'include' });
  return handleResponse(response);
}

// Create or update a tool
async function saveTool(tool, isEdit) {
  const url = isEdit
    ? `${API_BASE}/admin/tools/${tool.id}`
    : `${API_BASE}/admin/tools`;
  const method = isEdit ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool)
  });

  return response.ok;
}

// Delete a tool
async function deleteTool(toolId) {
  return fetch(`${API_BASE}/admin/tools/${toolId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
}


export {
  fetchTool,
  fetchToolPrompts,
  fetchToolEmotions,
  saveTool,
  deleteTool
};