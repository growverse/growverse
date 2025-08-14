import { Link } from 'react-router-dom';

export default function Landing(): JSX.Element {
  return (
    <div className="hero">
      <h1>Growverse</h1>
      <div className="cta">
        <Link to="/world">Enter World</Link>
        <Link to="/about">About</Link>
        <Link to="/auth">Login / Sign Up</Link>
      </div>
    </div>
  );
}
