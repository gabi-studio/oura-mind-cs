//--------------------------------------------
// /components/Tools/CompletedToolList.jsx
//
// Shows a list of tools that the user has already completedfor a specific journal entry
// Props:
// --- tools: array of completed tool objects (id, name, path)
// --- entryId: the journal entry ID
// Actions available for each tool:
// --- View: opens the read-only version
// --- Edit: opens the tool in editing mode
// --- Note: Delete is only available in the tool view/edit pages, not on the Tool Card
// If no tools, renders nothing
// This is very similar to the ReflectionToolList component, 
// But specifically for completed tools
//--------------------------------------------

import { Link } from 'react-router-dom';
import './CompletedToolList.css';

function CompletedToolList({ tools = [], entryId }) {
  if (!tools.length) return null;

  return (
    <div className="tools-section">
      <h2 className="tools-title">Completed Reflection Tools</h2>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card">
            <div className="tool-info">
              <div className="tool-name">{tool.name}</div>
            </div>
            <div className="tool-actions">
              <Link
                to={`/tools/${tool.path}/view/${entryId}`}
                className="tool-btn tool-btn-secondary"
              >
                View
              </Link>
              <Link
                to={`/tools/${tool.path}/edit/${entryId}`}
                className="tool-btn tool-btn-primary"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompletedToolList;
