'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import Toaster from '../../components/ui/toaster';

export default function RegisterPage() {
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
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: '', type: 'error' });
    setLoading(true);
    try {
      await register(formData);
      setToast({ message: 'Registration successful! Please login.', type: 'success' });
      setTimeout(() => router.push('/login'), 1000);
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
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="input input-bordered" />
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="input input-bordered" />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="input input-bordered" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input input-bordered" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input input-bordered" />
          <select name="role" value={formData.role} onChange={handleChange} className="input input-bordered">
            <option value="user">User</option>
            <option value="creator">Creator</option>
          </select>
          <button type="submit" disabled={loading} className="btn btn-primary mt-2">
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <span onClick={() => router.push('/login')} className="cursor-pointer font-semibold text-blue-600 hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
