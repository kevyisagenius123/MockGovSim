import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const register = useAuthStore(state => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('OMG, like, that registration totally failed. Is the username taken? So awkward.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Register</h1>
        <p className="text-sm text-center text-gray-400">Create your political identity</p>
        
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500">
          Register
        </button>
        {error && <p className="mt-4 text-sm text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage; 