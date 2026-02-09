
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import Toaster from '../../components/ui/toaster';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    first_name: '',
    last_name: '',
    role: 'user',
  });
  const [toast, setToast] = useState({ message: '', type: 'error' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: '', type: 'error' });
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        setToast({ message: 'Login successful!', type: 'success' });
        setTimeout(() => router.push('/'), 1000);
      } else {
        await register(formData);
        setIsLogin(true);
        setToast({ message: 'Registration successful! Please login.', type: 'success' });
      }
    } catch (err) {
      let msg = 'An error occurred';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') msg = err.response.data;
        else msg = Object.values(err.response.data).flat().join(' ');
      }
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Toaster message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="input input-bordered" />
              <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="input input-bordered" />
              <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="input input-bordered" />
            </>
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input input-bordered" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input input-bordered" />
          {!isLogin && (
            <select name="role" value={formData.role} onChange={handleChange} className="input input-bordered">
              <option value="user">User</option>
              <option value="creator">Creator</option>
            </select>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary mt-2">
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        // Add this after the regular login form

<div className="mt-6">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-gray-500">Or continue with</span>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-2 gap-3">
    <button
      onClick={() => window.location.href = 'http://localhost:8000/accounts/google/login/'}
      type="button"
      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span className="ml-2">Google</span>
    </button>

    <button
      onClick={() => window.location.href = 'http://localhost:8000/accounts/github/login/'}
      type="button"
      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
      </svg>
      <span className="ml-2">GitHub</span>
    </button>
  </div>
</div>
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} className="cursor-pointer font-semibold text-blue-600 hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}