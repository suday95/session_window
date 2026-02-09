'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

export default function SessionDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSession();
    }
  }, [params.id]);

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${params.id}/`);
      setSession(response.data);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!bookingDate) {
      alert('Please select a date and time');
      return;
    }

    setBooking(true);
    try {
      await api.post('/bookings/', {
        session: session.id,
        booking_date: bookingDate,
      });
      alert('Booking successful!');
      router.push('/dashboard');
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Session not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Session Image */}
        <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          {session.image_url ? (
            <img
              src={session.image_url}
              alt={session.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-9xl">📚</span>
          )}
        </div>

        {/* Session Content */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {session.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-blue-600">
                ${session.price}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{session.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Max {session.max_participants} participants</span>
            </div>
          </div>

          {/* Creator Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Created by</p>
            <p className="text-lg font-semibold text-gray-900">
              {session.creator_details?.first_name} {session.creator_details?.last_name}
            </p>
            <p className="text-sm text-gray-500">{session.creator_details?.email}</p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About this session</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {session.description}
            </p>
          </div>

          {/* Booking Section */}
          {user && user.role === 'user' ? (
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Session</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <button
                  onClick={handleBook}
                  disabled={booking || !bookingDate}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {booking ? 'Processing...' : `Book Now - $${session.price}`}
                </button>
              </div>
            </div>
          ) : user && user.role === 'creator' ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-700">
                You are logged in as a creator. Switch to a user account to book sessions.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-200">
              <p className="text-gray-700 mb-4">Please login to book this session</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login to Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}