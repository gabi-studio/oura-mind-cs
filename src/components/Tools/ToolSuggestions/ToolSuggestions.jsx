//--------------------------------------------
// /components/Tools/ToolSuggestions.jsx
// Shows a list of suggested reflection tools
// for the current journal entry based on detected emotions.
// Props:
// --- tools: array of tool objects (id, name, path, description, etc)
// --- entryId: the journal entry ID these tools are for
//--------------------------------------------
import React from 'react';
import './ToolSuggestions.css';

function ToolSuggestions({ tools, entryId }) {
    // Render noting if not tools are not available for some reason
  if (!tools || tools.length === 0) return null;

  // A list of suggested Reflection tools based on the user's emotions
  return (
    <div className="tools-section">
      <h2 className="tools-title">Suggested Reflection Tools</h2>
      <p className="tools-description">
        Based on your emotions, here are some tools that might help you reflect and grow:
      </p>

      {/* Reflection Tool Cards ---
      --- Each tool has a name, description, and a link to start the tool*/}
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card">
            <div className="tool-info">
              <div className="tool-name">{tool.name}</div>
              <div className="tool-description">
                {tool.description || 'Reflection tool to help process your emotions'}
              </div>
            </div>
            <div className="tool-actions">
              <a 
                href={`/tools/${tool.path}/${entryId}`}
                className="tool-btn tool-btn-primary"
              >
                Start Tool
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolSuggestions;