import React, { useState } from 'react';
import { XMarkIcon } from './common/Icons';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate and call an API.
    // Here we simulate a successful login.
    onLogin();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="aurora-card rounded-lg shadow-xl p-8 w-full max-w-md relative animate-slide-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XMarkIcon />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
              Log In
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="font-medium text-blue-400 hover:text-blue-300">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;