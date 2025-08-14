import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SessionCreate(): JSX.Element {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate('/session');
  }

  const disabled = !name || !role;

  return (
    <form onSubmit={onSubmit}>
      <h1>Create Session</h1>
      <div>
        <label>
          Session Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select role</option>
            <option value="learner">Learner</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={disabled}>Create</button>
    </form>
  );
}
