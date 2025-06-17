import { Link } from 'react-router-dom';

function ReflectionToolList({ tools, entryId }) {
  if (!tools || tools.length === 0) {
    return <p>No reflection tools completed yet.</p>;
  }

  return (
    <div>
      <h3>Completed Reflections</h3>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            <strong>{tool.name}</strong> <br />
            Submitted: {new Date(tool.created_at).toLocaleString()} <br />
            <Link to={`/tools/${tool.url_path}/${entryId}/view`}>View</Link>{' '}
            |{' '}
            <Link to={`/tools/${tool.url_path}/${entryId}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReflectionToolList;
