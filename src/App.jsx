import React, { useState } from 'react';
import Assessment from './components/Assessment';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [authMode, setAuthMode] = useState('assessment');
  const [adminPassword] = useState(import.meta.env.VITE_ADMIN_PASSWORD || 'demo');

  const handleAdminLogin = (password) => {
    if (password === adminPassword) {
      setAuthMode('admin-dashboard');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setAuthMode('assessment');
  };

  return (
    <>
      {authMode === 'assessment' && (
        <div>
          <Assessment />
          <div className="text-center py-4 text-sm text-gray-600">
            <button
              onClick={() => setAuthMode('admin-login')}
              className="hover:text-blue-600 underline"
            >
              Admin Access
            </button>
          </div>
        </div>
      )}

      {authMode === 'admin-login' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
          <div className="bg-slate-700 rounded-lg shadow-xl p-8 w-full max-w-sm border border-slate-600">
            <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
            <AdminLogin onSubmit={handleAdminLogin} onCancel={() => setAuthMode('assessment')} />
          </div>
        </div>
      )}

      {authMode === 'admin-dashboard' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </>
  );
}

function AdminLogin({ onSubmit, onCancel }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-slate-300 font-semibold mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter admin password"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition"
        >
          Back
        </button>
      </div>
    </form>
  );
}
