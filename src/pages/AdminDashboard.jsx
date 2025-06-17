//---------------------------------------
// /pages/AdminDashboard.jsx
// This page displays the Admin Dashboard for Admin users
// It shows journal stats, lists reflection tools, and provides full CRUD for tools
// It uses SimpleStats for stats, ListItem for each tool, and Modal for tool form
// Uses direct fetch calls to the API with credentials for admin operations
//---------------------------------------

import { useState, useEffect } from 'react';
import SimpleStats from '../components/SimpleStats/SimpleStats';
import ListItem from '../components/ListItem/ListItem';
import Modal from '../components/Modal/Modal';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import '../styles/Dashboard.css';

function AdminDashboard() {
  // State to storeall Reflection Tools
  const [tools, setTools] = useState([]);
  // State to store journal stats
  const [stats, setStats] = useState({});
  // For storing emotions
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');

  // Base URL for API calls, set via .env
  const API_BASE_URL = import.meta.env.VITE_OURA_API_BASE_URL;

  // Stores form input for creating/editing tools
  // This will be used in the modal form for creating/editing tools
  const [toolForm, setToolForm] = useState({
    name: '',
    description: '',
    path: '',
    instructions: '',
    prompts: [],
    emotions: []
  });


  // Load initial admin data when component mounts
  useEffect(() => {
    loadAdminData();
  }, []);


  //---------------------------------------
  // loadAdminData
  // Fetches emotions, tools, and stats from the server for admin view
  //---------------------------------------
  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch emotions from the server
      const emotionsRes = await fetch(`${API_BASE_URL}/admin/emotions`, { credentials: 'include' });
      if (emotionsRes.ok) {
        const data = await emotionsRes.json();
        setEmotions(data.emotions || []);
      }

      // Fetch tools from the server
      const toolsRes = await fetch(`${API_BASE_URL}/admin/tools`, { credentials: 'include' });
      if (toolsRes.ok) {
        const data = await toolsRes.json();
        setTools(data.tools || []);
      }

      // Fetch stats from the server
      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, { credentials: 'include' });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // If any of the fetches fail, return set message
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  //---------------------------------------
  // handleCreateTool
  // Resets the tool form to blank,
  // and opens modal in create mode
  //---------------------------------------
  const handleCreateTool = () => {
    setToolForm({
      name: '',
      description: '',
      path: '',
      instructions: '',
      prompts: [],
      emotions: []
    });
    setModalMode('create');
    setShowModal(true);
  };
  //---------------------------------------
  // handleEditTool
  // Loads tool data + prompts + emotions for editing
  // Opens modal in edit mode with pre-filled data
  //---------------------------------------
  const handleEditTool = async (toolId) => {
    const toolRes = await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, { credentials: 'include' });
    const promptsRes = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/prompts`, { credentials: 'include' });
    const emotionsRes = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/emotions`, { credentials: 'include' });

    // Parses the response to extract tool, prompts, and emotions
    const tool = (await toolRes.json()).tool;
    const prompts = (await promptsRes.json()).prompts || [];
    const toolEmotions = (await emotionsRes.json()).emotions || [];

    // Populate form with fetched data

    setToolForm({
      name: tool.name,
      description: tool.description,
      path: tool.path,
      instructions: tool.instructions || '',
      prompts: prompts.map(p => ({
        id: p.id,
        label: p.label || '',
        field_name: p.field_name || '',
        field_type: p.field_type || 'text',
        sort_order: p.sort_order || 0
      })),
      emotions: toolEmotions.map(e => e.id)
    });

    // Set selected tool for modal display
    setSelectedTool({ ...tool, prompts, emotions: toolEmotions });
    setModalMode('edit');
    setShowModal(true);
  };

  //---------------------------------------
  // handleViewTool
  // Loads tool data + prompts + emotions 
  // Uses modal for read-only view
  //---------------------------------------
  const handleViewTool = async (toolId) => {
    const toolRes = await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, { credentials: 'include' });
    const promptsRes = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/prompts`, { credentials: 'include' });
    const emotionsRes = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/emotions`, { credentials: 'include' });

   // Parse the response to extract tool, prompts, and emotions data
    const tool = (await toolRes.json()).tool;
    const prompts = (await promptsRes.json()).prompts || [];
    const toolEmotions = (await emotionsRes.json()).emotions || [];

    // Populate form with fetched data
    // But in view mode, so no editing allowed
    setSelectedTool({ ...tool, prompts, emotions: toolEmotions });
    setModalMode('view');
    setShowModal(true);
  };

  //---------------------------------------
  // handleDeleteTool
  // Confirms, then deletes a tool from backend + removes from local state.
  //---------------------------------------

  const handleDeleteTool = async (toolId) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    // Make DELETE request to server to remove the tool

    await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, { 
      method: 'DELETE', 
      credentials: 'include' });
      // Then remove from local state
      // Remove the tool with the given ID from the tools state
    setTools(tools.filter(t => t.id !== toolId));
  };


  //---------------------------------------
  // handleSaveTool
  // Submits form data to server for create or update
  // The method used depends on the modal mode
  // - If the admin is creating a new tool: POST to /admin/tools
  // - If editing an existing tool: PUT to /admin/tools/:id

  //---------------------------------------

  const handleSaveTool = async () => {
    const url = modalMode === 'create'
      ? `${API_BASE_URL}/admin/tools`
      : `${API_BASE_URL}/admin/tools/${selectedTool.id}`;
    const method = modalMode === 'create' ? 'POST' : 'PUT';

    // Make the fetch request
    // URL depends on modal mode
    // Include credentials for session management,
    // and send the tool form data as JSON in the body
    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toolForm)
    });

    if (res.ok) {
      // If successful, refresh Reflection Tools list and stats
      // and close the modal
      loadAdminData();
      setShowModal(false);
    } else {
      setError('Failed to save tool.');
    }
  };

  const addPrompt = () => {
    setToolForm({
      // Retain existing tool form data, including emotions, current prompts, title, description, etc.
      ...toolForm,

      // Update prompts to include a new blank prompt
      // This will add a new prompt with empty fields
      prompts: [
        ...toolForm.prompts,
        {
          label: '',
          field_name: '',
          field_type: 'text',
          sort_order: toolForm.prompts.length
        }
      ]
    });
  };

  //---------------------------------------
  // updatePrompt
  // Updates a specific prompt in the tool form
  // Takes index of prompt, field to update, and new value
  //---------------------------------------
  const updatePrompt = (index, field, value) => {

    // Create a copy of the current prompts array 
    // The copy will be modified
    // Update the specific prompt at the given index
    // Here field can be 'label', 'field_name', or 'field_type' (these are the columns in the prompts table)
    // This allows dynamic updates to the prompt fields
    // Reference: https://react.dev/learn/updating-arrays-in-state
    const updated = [...toolForm.prompts];
    
    updated[index][field] = value;

    // Update the tool form state with the modified prompts array
    setToolForm({ ...toolForm, prompts: updated });
  };


  //---------------------------------------
  // removePrompt
  // Removes a specific prompt from the tool form
  //-----------------------------------------
  const removePrompt = (index) => {
    setToolForm({
      // Retain existing tool form data, including emotions, title, description, etc.
      ...toolForm,

      // Filter out the prompt at the given index
      // This will remove the prompt from the prompts array
      prompts: toolForm.prompts.filter((_, i) => i !== index)
    });
  };
  
 //----------------------------------------
 // closeModal
 // Closes the modal without saving changes
 //----------------------------------------
  const closeModal = () => {
    setShowModal(false);
    setSelectedTool(null);
    setToolForm(initialToolForm);
  };



  // If loading, show loading spinner,
  // If error, show error message

  if (loading) return <LoadingSpinner text="Loading Admin Dashboard..." />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">


      {/* Using SimpleStats here to populate ReflectionTools and Journal Stats */}
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <SimpleStats stats={[
        { label: 'Total Users', value: stats.totalUsers || 0 },
        { label: 'Journal Entries', value: stats.totalEntries || 0 },
        { label: 'Active Tools', value: tools.length },
        { label: 'Tool Uses', value: stats.totalToolUsage || 0 }
      ]} />

      {/* Create New Tool Button */}
      <button onClick={handleCreateTool} className="new-entry-btn-simple">
        Create New Tool
      </button>



      {/* Add a dropdown to sort tools by number of uses, alphabetical */}
      <div className="sort-tools">
        <label htmlFor="sort-tools">Sort Tools By:</label>
        <select id="sort-tools" onChange={(e) => {
          const sortBy = e.target.value;  
          if (sortBy === 'uses') {
            setTools([...tools].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0)));
          } else if (sortBy === 'uses-reverse') {
            setTools([...tools].sort((a, b) => (a.usage_count || 0) - (b.usage_count || 0)));
          } else if (sortBy === 'alphabetical') {
            setTools([...tools].sort((a, b) => a.name.localeCompare(b.name)));
          
          } else {
            setTools([...tools]); // Reset to original order if no sort selected
          }
        }}>
          <option value="alphabetical">Alphabetical</option>
          
          <option value="uses">Most Uses</option>
          <option value="uses-reverse">Least Uses</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* List of Reflection Tools ---
      --- Uses ListItem component to display each tool
      --- Each tool card also has action buttons for viewing, editing, and deleting */}
      <div className="entry-list">
        {tools.map(tool => (
          <ListItem
            key={tool.id}
            title={tool.name}
            subtitle={`/${tool.path}`}
            preview={(tool.description || '').substring(0, 150)}
            stats={[
              `Uses: ${tool.usage_count || 0}`,
              
            ]}
            actions={[
              { label: 'View', onClick: () => handleViewTool(tool.id) },
              { label: 'Edit', onClick: () => handleEditTool(tool.id), variant: 'secondary' },
              { label: 'Delete', onClick: () => handleDeleteTool(tool.id), variant: 'delete' }
            ]}
          />
        ))}
      </div>


      {/* Modal for creating/editing/viewing tools 
      --- Uses the Modal component to display the tool form 
     */}
      {showModal && (
        <Modal
          title={modalMode === 'create' ? 'Create Tool' : modalMode === 'edit' ? 'Edit Tool' : 'View Tool'}
          onClose={() => setShowModal(false)}
          actions={modalMode === 'view' ? [] : [
            { label: modalMode === 'create' ? 'Create' : 'Save', onClick: handleSaveTool }
          ]}
        >

          {/* Tool Form inside the Modal 
          --- changes are disabled when in view mode 
          --- onChange updates the tool form state 
          --- Reference: https://www.geeksforgeeks.org/reactjs/react-onchange-event/ 
          --- These fields correspond to a property of the reflection_tools and reflection_tool_prompts in the database*/}
          <div className="modal-form">

            <label>Tool Name
              <input
                type="text"
                
                value={modalMode === 'view' ? selectedTool?.name : toolForm.name}
                onChange={e => setToolForm({ ...toolForm, name: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </label>

            <label>Path - This is the URL path for the tool.
              <input
                type="text"
                value={modalMode === 'view' ? selectedTool?.path : toolForm.path}
                onChange={e => setToolForm({ ...toolForm, path: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </label>

            <label>Description
              <textarea
                rows="3"
                placeholder="Write a brief description of the tool."
                value={modalMode === 'view' ? selectedTool?.description : toolForm.description}
                onChange={e => setToolForm({ ...toolForm, description: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </label>

            <label>Instructions
              <textarea
                rows="4"
                placeholder="Write instructions for using the tool."
                value={modalMode === 'view' ? selectedTool?.instructions : toolForm.instructions}
                onChange={e => setToolForm({ ...toolForm, instructions: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </label>


            {/* Emotions correspond to the Reflection Tool's categorization for which emotion it is intended for
            --- These are the same emotions that are detected from the Reflectors' Journal Entries through the Watson API
            --- This is mapped in database through the emotion_reflection_tool_map
            --- Using a simple checkbox to add */}
            <label>Emotions to Map Tool to:</label>
            <div className="checkbox-group">
              {/* Map through the list of Emotions and create a checkbox for each */}
              {emotions.map(emotion => (
                <label key={emotion.id}>
                  <input
                    type="checkbox"
                    // In view mode, check if the selected tool has this emotion, if so, check the box
                    checked={modalMode === 'view'
                      ? selectedTool?.emotions?.some(e => e.id === emotion.id)
                      : toolForm.emotions.includes(emotion.id)}

                    // Emotions not mapped to the tool are unchecked and disabled
                    disabled={modalMode === 'view'}

                    // Otherwise if not in view mode, the emotion can be checked/unchecked
                    // When checked, it adds the emotion ID to the toolForm.emotions array
                    // When unchecked, it removes the emotion ID from the toolForm.emotions array
                    onChange={(e) => {
                      if (modalMode === 'view') return;
                      setToolForm({
                        ...toolForm,
                        emotions: e.target.checked
                          ? [...toolForm.emotions, emotion.id]
                          : toolForm.emotions.filter(id => id !== emotion.id)
                      });
                    }}
                  /> {emotion.name}
                </label>
              ))}
            </div>


            {/* This is the prompts section --- */}
            <label>Prompts for Reflectors:</label>
            {(modalMode === 'view' ? selectedTool?.prompts : toolForm.prompts).map((prompt, i) => (
              <div key={i} className="prompt-item">

                {/* The Label is the label of the field ---
                This is the actual prompt */}
                <input
                  placeholder="Write Prompt here"
                  value={prompt.label}
                  onChange={e => updatePrompt(i, 'label', e.target.value)}
                  disabled={modalMode === 'view'}
                />


                <select
                  value={prompt.field_type}
                  onChange={e => updatePrompt(i, 'field_type', e.target.value)}
                  disabled={modalMode === 'view'}
                >

                  <option value="textarea">Text Area</option>
                  {/* <option value="text">Text</option> */}
                
                </select>
                {modalMode !== 'view' && (
                  <button onClick={() => removePrompt(i)} className="action-btn action-btn-secondary">X</button>
                )}
              </div>
            ))}
            {modalMode !== 'view' && (
              <button onClick={addPrompt} className="action-btn action-btn-primary">Add Prompt</button>

              
            )}

            

          </div>
              
              
          
        </Modal>
      )}

    </div>
  );
}

export default AdminDashboard;
