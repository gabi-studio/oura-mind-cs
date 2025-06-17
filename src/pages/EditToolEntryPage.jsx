

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchToolFormForEdit, updateToolForm } from '../services/toolService';
import ToolForm from '../components/ToolForm/ToolForm';
import './EditToolEntryPage.css';

function EditToolEntryPage() {
  const { toolPath, entryId } = useParams();
  const navigate = useNavigate();

  const [toolData, setToolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!toolPath || !entryId) {
      console.error('[EditToolEntryPage] Missing toolPath or entryId', { toolPath, entryId });
      setError('Missing information in the URL.');
      setLoading(false);
      return;
    }

    async function load() {
      try {
        console.log('[EditToolEntryPage] Loading tool data for edit...');
        const data = await fetchToolFormForEdit(toolPath, entryId);
        console.log('[EditToolEntryPage] Received tool data:', data);
        setToolData(data);
      } catch (err) {
        console.error('Error loading tool:', err);
        setError('Failed to load tool for editing.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [toolPath, entryId]);

  const handleSubmit = async (formData) => {
    try {
      await updateToolForm(toolPath, entryId, formData.answers, formData.moods);
      navigate(`/tools/${toolPath}/view/${entryId}`);
    } catch (err) {
      console.error('Error saving edits:', err);
      setError('Could not save your edits.');
    }
  };

  if (loading) {
    return <div className="journal-entry-loading">Loading reflection tool...</div>;
  }

  if (error) {
    return (
      <div className="journal-entry-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!toolData) {
    return <div className="journal-entry-loading">No tool data available...</div>;
  }

  // Debug info
  console.log('[EditToolEntryPage] About to render ToolForm with:', {
    prompts: toolData.prompts,
    moods: toolData.moods,
    initialAnswers: toolData.answers,
    initialMoodRatings: toolData.moodRatings,
    isEditMode: true
  });

  return (
    <div className="journal-entry-container">
      <div className="tools-section">
        <h2 className="tools-title">Edit Reflection Tool: {toolData.tool?.name}</h2>
        
        {/* Debug info */}
        <div style={{ background: '#ffff99', padding: '10px', marginBottom: '20px', fontSize: '12px' }}>
          <strong>Parent Debug:</strong>
          <br />toolData available: {toolData ? 'Yes' : 'No'}
          <br />answers: {JSON.stringify(toolData.answers)}
          <br />moodRatings: {JSON.stringify(toolData.moodRatings)}
          <br />prompts count: {toolData.prompts?.length || 0}
          <br />moods count: {toolData.moods?.length || 0}
        </div>
        
        <ToolForm
          prompts={toolData.prompts || []}
          moods={toolData.moods || []}
          initialAnswers={toolData.answers || {}}
          initialMoodRatings={toolData.moodRatings || {}}
          onSubmit={handleSubmit}
          isEditMode={true}
        />
      </div>
    </div>
  );
}

export default EditToolEntryPage;