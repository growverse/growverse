import { useState } from 'react';

export default function Auth(): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="card">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form>
        <input placeholder="Email" />
        <input type="password" placeholder="Password" />
        {!isLogin && <input type="password" placeholder="Confirm Password" />}
        <button className="btn" type="button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button className="btn secondary" type="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
      </button>
    </div>
  );
}
