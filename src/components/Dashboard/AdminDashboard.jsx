import { useState, useEffect } from 'react';
import './dashboard.css';

function AdminDashboard() {
  const [tools, setTools] = useState([]);
  const [stats, setStats] = useState({});
  const [dailyStats, setDailyStats] = useState([]);
  const [emotions, setemotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentView, setCurrentView] = useState('tools');
  const API_BASE_URL = import.meta.env.VITE_OURA_API_BASE_URL;

  // Form state for tool creation/editing
  const [toolForm, setToolForm] = useState({
    name: '',
    description: '',
    path: '',
    instructions: '',
    prompts: [],
    emotions: [] 
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading admin data...');
      
      // Fetch emotions first
      try {
        console.log('Fetching emotions...');
        const emotionsResponse = await fetch(`${API_BASE_URL}/admin/emotions`, {
          credentials: 'include'
        });
        
        if (emotionsResponse.ok) {
          const emotionsData = await emotionsResponse.json();
          console.log('emotions data:', emotionsData);
          setemotions(emotionsData.emotions || []);
        } else {
          console.warn('emotions endpoint not available:', emotionsResponse.status);
          setemotions([]);
        }
      } catch (emotionsError) {
        console.warn('Error fetching emotions:', emotionsError);
        setemotions([]);
      }
      
      // Fetch tools first (this should work with your existing API)
      try {
        console.log('Fetching tools...');
        console.log('API_BASE_URL:', API_BASE_URL);
        console.log('Token:', localStorage.getItem('token'));
        console.log('All localStorage keys:', Object.keys(localStorage));
        
        // Let's also check cookies
        console.log('Document cookies:', document.cookie);
        
        const toolsResponse = await fetch(`${API_BASE_URL}/admin/tools`, {
          credentials: 'include'
        });
        
        console.log('Tools response status:', toolsResponse.status);
        
        if (toolsResponse.ok) {
          const responseText = await toolsResponse.text();
          console.log('Raw response:', responseText.substring(0, 500)); // Show first 500 chars
          
          try {
            const toolsData = JSON.parse(responseText);
            console.log('Tools data:', toolsData);
            setTools(toolsData.tools || []);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response was not JSON. First 200 chars:', responseText.substring(0, 200));
            setError('Server returned HTML instead of JSON. Check if /api/admin/tools route exists.');
            return;
          }
        } else {
          console.error('Tools fetch failed:', toolsResponse.status, await toolsResponse.text());
        }
      } catch (toolsError) {
        console.error('Tools fetch error:', toolsError);
        setError('Error loading tools: ' + toolsError.message);
        return;
      }

      // Try to fetch stats (may not exist yet)
      try {
        console.log('Fetching stats...');
        const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
          credentials: 'include'
        });
        
        console.log('Stats response status:', statsResponse.status);
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Stats data:', statsData);
          setStats(statsData);
        } else {
          console.warn('Stats endpoint not available yet:', statsResponse.status);
          // Set default stats if endpoint doesn't exist
          setStats({
            totalUsers: 0,
            totalEntries: 0,
            totalToolUsage: 0
          });
        }
      } catch (statsError) {
        console.warn('Stats fetch error (using defaults):', statsError);
        setStats({
          totalUsers: 0,
          totalEntries: 0,
          totalToolUsage: 0
        });
      }

      // Try to fetch daily stats (may not exist yet)
      try {
        console.log('Fetching daily stats...');
        const dailyResponse = await fetch(`${API_BASE_URL}/admin/stats/daily?days=7`, {
          credentials: 'include'
        });
        
        console.log('Daily stats response status:', dailyResponse.status);
        
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          console.log('Daily stats data:', dailyData);
          setDailyStats(dailyData);
        } else {
          console.warn('Daily stats endpoint not available yet:', dailyResponse.status);
          setDailyStats([]);
        }
      } catch (dailyError) {
        console.warn('Daily stats fetch error (using defaults):', dailyError);
        setDailyStats([]);
      }

      console.log('Admin data loading completed');

    } catch (err) {
      console.error('General error loading admin data:', err);
      setError('Error loading admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditTool = async (toolId) => {
    try {
      // Fetch tool details
      const toolResponse = await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, {
        credentials: 'include'
      });
      
      // Fetch tool prompts
      let prompts = [];
      try {
        const promptsResponse = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/prompts`, {
          credentials: 'include'
        });
        
        if (promptsResponse.ok) {
          const promptsData = await promptsResponse.json();
          prompts = promptsData.prompts || [];
        } else {
          console.warn('Prompts endpoint not available:', promptsResponse.status);
        }
      } catch (promptError) {
        console.warn('Error fetching prompts:', promptError);
      }
      
      // Fetch tool emotions
      let toolemotions = [];
      try {
        const emotionsResponse = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/emotions`, {
          credentials: 'include'
        });
        
        if (emotionsResponse.ok) {
          const emotionsData = await emotionsResponse.json();
          toolemotions = emotionsData.emotions || [];
        } else {
          console.warn('Tool emotions endpoint not available:', emotionsResponse.status);
        }
      } catch (emotionError) {
        console.warn('Error fetching tool emotions:', emotionError);
      }
      
      if (toolResponse.ok) {
        const toolData = await toolResponse.json();
        const tool = toolData.tool;
        
        console.log('Tool data:', tool);
        console.log('Prompts data:', prompts);
        console.log('Tool emotions:', toolemotions);
        
        setToolForm({
          name: tool.name,
          description: tool.description,
          path: tool.path,
          instructions: tool.instructions || '',
          prompts: prompts.map(prompt => ({
            id: prompt.id,
            label: prompt.label || '',
            field_name: prompt.field_name || '',
            field_type: prompt.field_type || 'text',
            sort_order: prompt.sort_order || 0
          })),
          emotions: toolemotions.map(emotion => emotion.id)
        });
        setSelectedTool({ ...tool, prompts, emotions: toolemotions });
        setModalMode('edit');
        setShowModal(true);
      }
    } catch (err) {
      setError('Error fetching tool details');
    }
  };

  const handleViewTool = async (toolId) => {
    try {
      // Fetch tool details
      const toolResponse = await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, {
        credentials: 'include'
      });
      
      // Fetch tool prompts  
      let prompts = [];
      try {
        const promptsResponse = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/prompts`, {
          credentials: 'include'
        });
        
        if (promptsResponse.ok) {
          const promptsData = await promptsResponse.json();
          prompts = promptsData.prompts || [];
        } else {
          console.warn('Prompts endpoint not available:', promptsResponse.status);
        }
      } catch (promptError) {
        console.warn('Error fetching prompts:', promptError);
      }
      
      // Fetch tool emotions  
      let toolemotions = [];
      try {
        const emotionsResponse = await fetch(`${API_BASE_URL}/admin/tools/${toolId}/emotions`, {
          credentials: 'include'
        });
        
        if (emotionsResponse.ok) {
          const emotionsData = await emotionsResponse.json();
          toolemotions = emotionsData.emotions || [];
        } else {
          console.warn('Tool emotions endpoint not available:', emotionsResponse.status);
        }
      } catch (emotionError) {
        console.warn('Error fetching tool emotions:', emotionError);
      }
      
      if (toolResponse.ok) {
        const toolData = await toolResponse.json();
        const tool = toolData.tool;
        
        console.log('View tool data:', tool);
        console.log('View prompts data:', prompts);
        console.log('View tool emotions:', toolemotions);
        
        setSelectedTool({ 
          ...tool, 
          prompts: prompts.map(prompt => ({
            id: prompt.id,
            label: prompt.label || '',
            field_name: prompt.field_name || '',
            field_type: prompt.field_type || 'text',
            sort_order: prompt.sort_order || 0
          })),
          emotions: toolemotions
        });
        setModalMode('view');
        setShowModal(true);
      }
    } catch (err) {
      setError('Error fetching tool details');
    }
  };

  const handleDeleteTool = async (toolId) => {
    if (!window.confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setTools(tools.filter(tool => tool.id !== toolId));
        setError('');
      } else {
        setError('Failed to delete tool');
      }
    } catch (err) {
      setError('Error deleting tool');
    }
  };

  const handleSaveTool = async () => {
    try {
      const url = modalMode === 'create' 
        ? `${API_BASE_URL}/admin/tools` 
        : `${API_BASE_URL}/admin/tools/${selectedTool.id}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toolForm)
      });
      
      if (response.ok) {
        loadAdminData(); // Refresh the data
        setShowModal(false);
        setError('');
      } else {
        setError('Failed to save tool');
      }
    } catch (err) {
      setError('Error saving tool');
    }
  };

  const addPrompt = () => {
    setToolForm({
      ...toolForm,
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

  const updatePrompt = (index, field, value) => {
    const updatedPrompts = [...toolForm.prompts];
    updatedPrompts[index][field] = value;
    setToolForm({ ...toolForm, prompts: updatedPrompts });
  };

  const removePrompt = (index) => {
    const updatedPrompts = toolForm.prompts.filter((_, i) => i !== index);
    setToolForm({ ...toolForm, prompts: updatedPrompts });
  };

  if (loading) {
    return (
      <div className="loading-simple">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading dashboard: {error}</p>
        <button onClick={loadAdminData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Simple Stats */}
      <div className="simple-stats">
        <div className="simple-stat">
          <p className="simple-stat-number">{stats.totalUsers || 0}</p>
          <p className="simple-stat-label">Total Users</p>
        </div>
        <div className="simple-stat">
          <p className="simple-stat-number">{stats.totalEntries || 0}</p>
          <p className="simple-stat-label">Journal Entries</p>
        </div>
        <div className="simple-stat">
          <p className="simple-stat-number">{tools.length}</p>
          <p className="simple-stat-label">Active Tools</p>
        </div>
        <div className="simple-stat">
          <p className="simple-stat-number">{stats.totalToolUsage || 0}</p>
          <p className="simple-stat-label">Tool Uses</p>
        </div>
      </div>

      {/* View Controls */}
      <div className="view-controls">
        
        {currentView === 'tools' && (
          <button onClick={handleCreateTool} className="new-entry-btn-simple">
            Create New Tool
          </button>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          color: '#c00',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <p>{error}</p>
          <button onClick={loadAdminData} className="retry-btn" style={{ marginTop: '0.5rem' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Tools View */}
      {currentView === 'tools' && (
        <div className="dashboard-content">
          <div className="content-header">
            <h2 className="content-title">Reflection Tools</h2>
          </div>

          <div className="content-body">
            {tools.length === 0 ? (
              <div className="empty-state-simple">
                <p>No tools created yet.</p>
                <button onClick={handleCreateTool} className="empty-state-link-simple">
                  Create your first tool
                </button>
              </div>
            ) : (
              <div className="entry-list">
                {tools.map(tool => (
                  <div key={tool.id} className="entry-item">
                    <div className="entry-item-header">
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                          {tool.name}
                        </h3>
                        <span className="entry-time">/{tool.path}</span>
                      </div>
                      <div className="entry-actions">
                        <button
                          onClick={() => handleViewTool(tool.id)}
                          className="action-btn action-btn-primary"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditTool(tool.id)}
                          className="action-btn action-btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTool(tool.id)}
                          className="action-btn action-btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="entry-preview">
                      {(tool.description || 'No description available').substring(0, 150)}
                      {tool.description && tool.description.length > 150 ? '...' : ''}
                    </p>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                      <span>Uses: {tool.usage_count || 0}</span>
                      
                      {tool.emotions && tool.emotions.length > 0 && (
                        <span>emotions: {tool.emotions.map(m => m.name).join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Create/Edit/View Tool */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                {modalMode === 'create' ? 'Create New Tool' : 
                 modalMode === 'edit' ? 'Edit Tool' : 'View Tool'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tool Name</label>
                <input
                  type="text"
                  value={modalMode === 'view' ? selectedTool?.name || '' : toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  disabled={modalMode === 'view'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e8e8e8',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    backgroundColor: modalMode === 'view' ? '#f5f5f5' : 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Path</label>
                <input
                  type="text"
                  value={modalMode === 'view' ? selectedTool?.path || '' : toolForm.path}
                  onChange={(e) => setToolForm({ ...toolForm, path: e.target.value })}
                  disabled={modalMode === 'view'}
                  placeholder="e.g., gratitude-journal"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e8e8e8',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    backgroundColor: modalMode === 'view' ? '#f5f5f5' : 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                <textarea
                  value={modalMode === 'view' ? selectedTool?.description || '' : toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  disabled={modalMode === 'view'}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e8e8e8',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    backgroundColor: modalMode === 'view' ? '#f5f5f5' : 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Instructions</label>
                <textarea
                  value={modalMode === 'view' ? selectedTool?.instructions || '' : toolForm.instructions}
                  onChange={(e) => setToolForm({ ...toolForm, instructions: e.target.value })}
                  disabled={modalMode === 'view'}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e8e8e8',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    backgroundColor: modalMode === 'view' ? '#f5f5f5' : 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Emotions Section */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Emotions this tool helps with
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '0.5rem',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  padding: '1rem'
                }}>
                  {emotions.map(emotion => (
                    <label key={emotion.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={modalMode === 'view' 
                          ? selectedTool?.emotions?.some(m => m.id === emotion.id) || false
                          : toolForm.emotions.includes(emotion.id)
                        }
                        onChange={(e) => {
                          if (modalMode === 'view') return;
                          
                          if (e.target.checked) {
                            setToolForm({
                              ...toolForm,
                              emotions: [...toolForm.emotions, emotion.id]
                            });
                          } else {
                            setToolForm({
                              ...toolForm,
                              emotions: toolForm.emotions.filter(id => id !== emotion.id)
                            });
                          }
                        }}
                        disabled={modalMode === 'view'}
                        style={{ margin: 0 }}
                      />
                      {emotion.name}
                    </label>
                  ))}
                </div>
                {emotions.length === 0 && (
                  <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                    No emotions available. Add emotions to the database first.
                  </p>
                )}
              </div>

              {/* Prompts Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ fontWeight: '600' }}>Prompts</label>
                  {modalMode !== 'view' && (
                    <button
                      onClick={addPrompt}
                      className="action-btn action-btn-primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Add Prompt
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(modalMode === 'view' ? selectedTool?.prompts || [] : toolForm.prompts).map((prompt, index) => (
                    <div key={index} style={{
                      border: '1px solid #e8e8e8',
                      borderRadius: '6px',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '600' }}>Label</label>
                          <input
                            type="text"
                            value={prompt.label}
                            onChange={(e) => updatePrompt(index, 'label', e.target.value)}
                            disabled={modalMode === 'view'}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #e8e8e8',
                              borderRadius: '4px',
                              fontSize: '0.9rem',
                              backgroundColor: modalMode === 'view' ? '#f5f5f5' : 'white'
                            }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '600' }}>Type</label>
                            <select
                              value={prompt.field_type}
                              onChange={(e) => updatePrompt(index, 'field_type', e.target.value)}
                              disabled={modalMode === 'view'}
                              style={{
                                padding: '0.5rem',
                                border: '1px solid #e8e8e8',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                backgroundColor: modalMode === 'view' ? '#f5f5f5' : 'white'
                              }}
                            >
                              <option value="text">Text</option>
                              <option value="textarea">Textarea</option>
                              <option value="number">Number</option>
                              <option value="select">Select</option>
                            </select>
                          </div>
                          {modalMode !== 'view' && (
                            <button
                              onClick={() => removePrompt(index)}
                              className="action-btn action-btn-delete"
                              style={{ padding: '0.5rem' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowModal(false)}
                className="action-btn action-btn-secondary"
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode === 'view' && (
                <button
                  onClick={() => {
                    setModalMode('edit');
                    // Copy selectedTool data to toolForm for editing
                    setToolForm({
                      name: selectedTool.name,
                      description: selectedTool.description,
                      path: selectedTool.path,
                      instructions: selectedTool.instructions || '',
                      prompts: selectedTool.prompts || [],
                      emotions: selectedTool.emotions?.map(m => m.id) || []
                    });
                  }}
                  className="action-btn action-btn-primary"
                >
                  Edit Tool
                </button>
              )}
              {modalMode !== 'view' && modalMode !== 'create' && (
                <button
                  onClick={handleSaveTool}
                  className="action-btn action-btn-primary"
                >
                  Save Changes
                </button>
              )}
              {modalMode === 'create' && (
                <button
                  onClick={handleSaveTool}
                  className="action-btn action-btn-primary"
                >
                  Create Tool
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;