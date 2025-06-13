import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('OMG, like, wrong username or password. As if!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 space-y-6 bg-card border border-border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-text-primary">Login</h1>
        <p className="text-sm text-center text-text-secondary">Access your dashboard</p>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-text-secondary">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 text-text-primary bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-text-secondary">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-text-primary bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-accent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-accent">
          Login
        </button>
        {error && <p className="mt-4 text-sm text-center text-scandal">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage; 