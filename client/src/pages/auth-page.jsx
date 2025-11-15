import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const handleSwitch = () => {
    setIsLogin((v) => !v);
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
      console.log(data)
      if (!res.ok) throw new Error(data.message || 'Error');
      setMsg(isLogin ? 'Login successful!' : 'Signup successful! You can now log in.');
      setMsgType('success');
      if (!isLogin) setIsLogin(true);
    } catch (err) {
      setMsg(err.message);
      setMsgType('error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name (signup only)"
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
        <button type="submit" style={{ background: '#4caf50', color: '#fff', border: 'none', fontWeight: 'bold' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
        <button onClick={handleSwitch} style={{ background: '#2196f3', color: '#fff', border: 'none', marginLeft: 8 }}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
      {msg && (
        <div style={{ color: msgType === 'success' ? '#080' : '#c00', textAlign: 'center', marginTop: 8 }}>{msg}</div>
      )}
    </div>
  );
}
