//---------------------------------------
// /pages/ToolFormPage.jsx
//
// Allows Reflectors to fill out a Reflection Tool.
// --- Fetches prompts and moods for the given tool + journal entry
// --- Allows answers + mood ratings
// --- Submits or updates via toolService
//---------------------------------------

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ToolForm from '../components/ToolForm/ToolForm';
import { 
    fetchToolForm, 
    submitToolForm, 
    fetchToolFormForEdit, 
    updateToolForm 
} from '../services/toolService';
import './ToolFormPage.css';

function ToolFormPage({ user, isEditing = false }) {
  const { toolPath, entryId } = useParams();
  const navigate = useNavigate();

  const [toolData, setToolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
            // console.log('[ToolFormPage] isEditing:', isEditing);
            // console.log('[ToolFormPage] Fetching data for:', { toolPath, entryId });
        
        let data;
        if (isEditing) {
          // Load existing data for editing
          // Use fetchToolFormForEdit to get existing answers and moods
          data = await fetchToolFormForEdit(toolPath, entryId);
          // console.log('[ToolFormPage] Edit data loaded:', data);
        } else {
          // If on new submission mode, use fetchToolForm
          // Load fresh form for new submission

          data = await fetchToolForm(toolPath, entryId);
          //console.log('[ToolFormPage] Fresh form loaded:', data);
        }
        
        setToolData(data);
      } catch (err) {
        console.error('[ToolFormPage] Error:', err);
        setError('Failed to load tool data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [toolPath, entryId, isEditing]);

  // Handle form submission
  // If editing, update existing submission
  // If creating new Reflection, submit new answers to form
  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        // Update existing submission
        await updateToolForm(toolPath, entryId, formData.answers, formData.moods);
        console.log('[ToolFormPage] Updated existing submission');
      } else {
        // Create new submission
        await submitToolForm(toolPath, entryId, formData.answers, formData.moods);
        console.log('[ToolFormPage] Created new submission');
      }
      
      // Redirect to view page of Reflection Tool after submission
      navigate(`/tools/${toolPath}/view/${entryId}`);
    } catch (err) {
      console.error('[ToolFormPage] Error saving:', err);
      setError(isEditing ? 'Could not save your edits.' : 'Could not save your reflection.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!toolData) return <p>No tool data available.</p>;

  return (
    <div className="tools-section">
      <h2 className="tools-title">
        {isEditing ? `Edit: ${toolData.tool.name}` : toolData.tool.name}
      </h2>
      
      
      <ToolForm
        prompts={toolData.prompts}
        moods={toolData.moods}
        initialAnswers={isEditing ? (toolData.answers || {}) : {}}
        initialMoodRatings={isEditing ? (toolData.moodRatings || {}) : {}}
        onSubmit={handleSubmit}
        isEditMode={isEditing}
      />
    </div>
  );
}

export default ToolFormPage;