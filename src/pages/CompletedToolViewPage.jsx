//-----------------------------------
// CompletedToolViewPage.jsx
// Read-only page to view Completed/submitted Reflection Tools

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchToolForView, deleteToolSubmission } from '../services/toolService';
import './CompletedToolViewPage.css';

function CompletedToolViewPage() {
  const { path, entryId } = useParams();
  const navigate = useNavigate();

  const [toolData, setToolData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    //------------------------------
    // Function to load the completed tool data
    // This will get the tool data for the given path and entryId
    //------------------------------
    async function loadCompletedTool() {
      try {
        const data = await fetchToolForView(path, entryId);
        setToolData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading completed tool:', err);
      }
    }
    loadCompletedTool();
  }, [path, entryId]);


  //------------------------------
  // Function to calculate the change in mood ratings before and after the tool submission
  // It takes the before and after values, calculates the difference,
  // and returns the percentage change.
  //------------------------------
  function calculateChange(before, after) {
  const diff = after - before;

  // For a 1-5 scale, the maximum possible change is 4 points (1 to 5 or 5 to 1)
  // So percentage should be: (actual change / max possible change) * 100
  const maxPossibleChange = 4;
  const percent = (Math.abs(diff) / maxPossibleChange) * 100;
  
  if (diff === 0) {
    return "No change";
  }
  
  const sign = diff > 0 ? '+' : '-';
  return `${sign}${percent.toFixed(0)}%`;
}


//------------------------------
// Function to handle deletion of the Reflection tool submission
// It prompts the user for confirmation, and if confirmed,
// it calls the deleteToolSubmission service function
// And navigates back to the Journal Entry page.
  async function handleDelete() {
    const confirmDelete = window.confirm('Are you sure you want to delete this reflection?');
    if (!confirmDelete) return;

    try {
      await deleteToolSubmission(path, entryId);
      navigate(`/journal/${entryId}`);
    } catch (err) {
      console.error('Error deleting reflection:', err);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!toolData) return <p>Tool not found.</p>;

  const { tool, prompts, responseMap, moodRatings, moods } = toolData;

  return (
    <div className="tool-form-page">
      <div className="tool-form-container">
        <h1 className="tool-title">{tool.name}</h1>
        <p className="tool-description">{tool.description}</p>
        <p className="tool-instructions">{tool.instructions}</p>

        <div className="tool-section">
          <h2 className="section-title">Mood Changes</h2>
          {Object.entries(moodRatings).map(([moodName, values]) => (
            <div key={moodName} className="mood-rating-group">
              <label className="mood-label">{moodName}</label>
              <span>
                {values.before} → {values.after} ({calculateChange(values.before, values.after)})
              </span>
            </div>
          ))}
        </div>

        <div className="tool-section">
          <h2 className="section-title">Your Responses</h2>
          {prompts.map((prompt) => (
            <div key={prompt.id} className="prompt-group">
              <label className="prompt-label">{prompt.label}</label>
              <p className="prompt-response">{responseMap[prompt.id]}</p>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            className="tool-btn tool-btn-secondary"
            onClick={() => navigate(`/tools/${path}/edit/${entryId}`)}
          >
            Edit
          </button>
          <button
            className="tool-btn tool-btn-secondary"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="tool-btn tool-btn-secondary"
            onClick={() => navigate(`/journal/${entryId}`)}
          >
            Back to Journal Entry
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletedToolViewPage;
