import { Link } from 'react-router-dom';

// Displays the list of completed reflection tools for a given journal entry
function CompletedToolList({ tools, entryId }) {
  if (!tools || tools.length === 0) {
    return <p>No tools completed for this entry yet.</p>;
  }

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id} style={{ marginBottom: '1rem' }}>
          <strong>{tool.name}</strong> –&nbsp;
          <Link to={`/tools/${tool.url_path}/${entryId}/view`}>View</Link> |&nbsp;
          <Link to={`/tools/${tool.url_path}/${entryId}/edit`}>Edit</Link> |&nbsp;
          <Link to={`/tools/${tool.url_path}/${entryId}/delete`}>Delete</Link>
        </li>
      ))}
    </ul>
  );
}

export default CompletedToolList;
