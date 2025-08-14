import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SessionLeave(): JSX.Element {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const name = params.get('name');
  const currentLearners = params.get('currentLearners');
  const maxLearners = params.get('maxLearners');
  const currentTime = params.get('currentTime');
  const currentTimezone = params.get('currentTimezone');
  return (
    <div className="container">
      <h1>You have left the session.</h1>
      {name && (
        <div className="card" style={{ margin: '2rem 0' }}>
          <h2>{name}</h2>
          {currentLearners && maxLearners && (
            <p>
              {currentLearners} / {maxLearners} learners
            </p>
          )}
          {currentTime && currentTimezone && (
            <p>
              Time: {currentTime} ({currentTimezone})
            </p>
          )}
        </div>
      )}
      <button className="btn" onClick={() => navigate('/')}>Return to Landing</button>
    </div>
  );
}
