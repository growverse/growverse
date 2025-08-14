export default function SessionLogin(): JSX.Element {
  return (
    <div className="container">
      <div className="card">
        <h1>Join with URL</h1>
        <div className="join-section">
          <input placeholder="Session URL" />
          <button className="btn">Join</button>
        </div>
      </div>
    </div>
  );
}
