'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my_bookings/');
      const data = response.data.results || response.data;
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.patch(`/bookings/${id}/`, { status: 'cancelled' });
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back, {user?.first_name || user?.username}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">
              {bookings.length}
            </h3>
            <p className="text-gray-600">Total Bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold text-green-600 mb-2">
              {bookings.filter(b => b.status === 'confirmed').length}
            </h3>
            <p className="text-gray-600">Active Bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold text-purple-600 mb-2">
              {bookings.filter(b => b.status === 'completed').length}
            </h3>
            <p className="text-gray-600">Completed</p>
          </div>
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-gray-600 mb-6">
                You haven't booked any sessions yet.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Browse Sessions
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {booking.session_details?.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {booking.session_details?.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.booking_date).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {booking.session_details?.duration} minutes
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="font-semibold text-blue-600 text-xl">
                        ${booking.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/sessions/${booking.session_details?.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Session
                    </Link>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute requiredRole="user">
      <UserDashboard />
    </PrivateRoute>
  );
}