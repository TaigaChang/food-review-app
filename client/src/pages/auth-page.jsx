import { useState } from 'react';
import '../styles/auth-page.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const handleSwitch = () => {
    setIsLogin(v => !v);
    setMsg('');
    setMsgType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');
    let url, body;
    if (isLogin) {
      url = '/api/auth/login';
      body = { email, password };
    } else {
      url = '/api/auth/signup';
      body = { name_first: name, name_last: '', email, password };
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setMsg(isLogin ? 'Login successful! Welcome back to Umami.' : 'Signup successful! You can now log in.');
      setMsgType('success');
      if (!isLogin) setIsLogin(true);
    } catch (err) {
      setMsg(err.message);
      setMsgType('error');
    }
  };

  return (
    <div id="authpage-root">
      <div className="auth-container">
        <h2>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
        <p style={{ textAlign: 'center', margin: '0 0 1.5rem', color: '#555', fontSize: '0.95rem' }}>
          {isLogin
            ? 'Log in to track tastes, rate experiences & discover smarter recommendations.'
            : 'Join Umami to rate taste, ambiance & pricing with rich 100-point reviews.'}
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required={!isLogin}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          <button type="submit">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-switch">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button onClick={handleSwitch} type="button">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
        {msg && (
          <div className={`auth-msg ${msgType}`}>{msg}</div>
        )}
      </div>
    </div>
  );
}
