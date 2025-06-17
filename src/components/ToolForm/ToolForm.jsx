import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ToolForm.css';

function ToolForm({
  prompts,
  moods,
  initialAnswers = {},
  initialMoodRatings = {},
  onSubmit,
  isEditMode = false,
}) {
  const [answers, setAnswers] = useState({});
  const [beforeMoods, setBeforeMoods] = useState({});
  const [afterMoods, setAfterMoods] = useState({});
  const navigate = useNavigate();

  // Update state whenever initialAnswers or initialMoodRatings change
  useEffect(() => {
    console.log('[ToolForm useEffect] Running with:', { 
      initialAnswers, 
      initialMoodRatings, 
      moods: moods?.length,
      isEditMode 
    });
    
    // Only proceed if we have the necessary data
    if (!moods || moods.length === 0) {
      console.log('[ToolForm useEffect] No moods yet, skipping');
      return;
    }
    
    // Normalize answers
    const normalized = {};
    for (const key in initialAnswers) {
      normalized[parseInt(key)] = initialAnswers[key];
      console.log(`[ToolForm] Setting answer ${key} to:`, initialAnswers[key]);
    }
    console.log('[ToolForm] Final normalized answers:', normalized);
    setAnswers(normalized);

    // Set up mood ratings
    const before = {};
    const after = {};
    moods.forEach((mood) => {
      const name = mood.name;
      const beforeVal = initialMoodRatings[name]?.before ?? 3;
      const afterVal = initialMoodRatings[name]?.after ?? 3;
      before[mood.id] = beforeVal;
      after[mood.id] = afterVal;
      console.log(`[ToolForm] Setting mood ${name} (${mood.id}): before=${beforeVal}, after=${afterVal}`);
    });

    console.log('[ToolForm] Final mood states:', { before, after });
    setBeforeMoods(before);
    setAfterMoods(after);
  }, [initialAnswers, initialMoodRatings, moods, isEditMode]);

  const handlePromptChange = (promptId, value) => {
    setAnswers((prev) => ({ ...prev, [promptId]: value }));
  };

  const handleMoodChange = (type, moodId, value) => {
    const setter = type === 'before' ? setBeforeMoods : setAfterMoods;
    setter((prev) => ({ ...prev, [moodId]: parseInt(value, 10) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const moodRatings = moods.map((mood) => ({
      mood_id: mood.id,
      before: beforeMoods[mood.id] || 0,
      after: afterMoods[mood.id] || 0,
    }));
    onSubmit({ answers, moods: moodRatings });
  };

  return (
    <div className="journal-entry-page">
      <div className="journal-entry-container">
        <button className="action-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          ← Back
        </button>


        <form className="tools-section" onSubmit={handleSubmit}>
          <h2 className="tools-title">How are you feeling <em>before</em> this activity?</h2>
          {moods.map((mood) => (
            <div key={`before-${mood.id}`} className="entry-content">
              <label>{mood.name}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={beforeMoods[mood.id] ?? 3}
                onChange={(e) => handleMoodChange('before', mood.id, e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>{beforeMoods[mood.id] ?? 3}</span>
            </div>
          ))}

          <h2 className="tools-title">Reflection Prompts</h2>
          {prompts.map((prompt) => (
            <div key={prompt.id} className="entry-content">
              <label>{prompt.label}</label>
              <textarea
                value={answers[prompt.id] ?? ''}
                onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
                rows={4}
              />
            </div>
          ))}

          <h2 className="tools-title">How are you feeling <em>after</em> this activity?</h2>
          {moods.map((mood) => (
            <div key={`after-${mood.id}`} className="entry-content">
              <label>{mood.name}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={afterMoods[mood.id] ?? 3}
                onChange={(e) => handleMoodChange('after', mood.id, e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>{afterMoods[mood.id] ?? 3}</span>
            </div>
          ))}

          <button type="submit" className="tool-btn tool-btn-primary" style={{ marginTop: '1rem' }}>
            {isEditMode ? 'Save Changes' : 'Submit Reflection'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ToolForm;