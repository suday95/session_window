'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Loader, Clock, Users, Calendar, AlertCircle, CreditCard, CheckCircle, XCircle } from 'lucide-react';

export default function SessionDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [booking, setBooking] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchSession();
      if (user) {
        fetchUserBookings();
      }
    }
  }, [params.id, user]);

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

  const fetchUserBookings = async () => {
    try {
      const response = await api.get('/bookings/');
      setUserBookings(response.data);
      
      const hasBooked = response.data.some(
        booking => booking.session === params.id && booking.status !== 'cancelled'
      );
      setAlreadyBooked(hasBooked);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const handleBookClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!bookingDate) {
      alert('Please select a date and time');
      return;
    }

    // Show payment modal
    setShowPaymentModal(true);
    setPaymentError('');
    setPaymentSuccess(false);
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    setPaymentError('');

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful payment (in real app, this would call a payment gateway)
    const paymentSuccessful = true; // Always succeeds for now

    if (paymentSuccessful) {
      try {
        // Create booking with payment status as 'paid'
        await api.post('/bookings/', {
          session: session.id,
          booking_date: bookingDate,
          payment_status: 'paid',
          status: 'confirmed',
        });
        
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        
        // Redirect after showing success
        setTimeout(() => {
          setShowPaymentModal(false);
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        let errorMsg = 'Booking failed';
        if (error.response?.data) {
          // Handle different error formats
          if (error.response.data.session) {
            errorMsg = error.response.data.session;
          } else if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            errorMsg = error.response.data;
          } else {
            errorMsg = JSON.stringify(error.response.data);
          }
        }
        setPaymentError(errorMsg);
        setPaymentProcessing(false);
      }
    } else {
      setPaymentError('Payment failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const closePaymentModal = () => {
    if (!paymentProcessing) {
      setShowPaymentModal(false);
      setPaymentError('');
      setPaymentSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session not found</h2>
          <p className="text-gray-600 mb-6">The session you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/sessions')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const isFull = session?.is_full || false;
  const spotsAvailable = session?.spots_available || 0;
  const canBook = user && user.role?.toLowerCase() !== 'creator' && !alreadyBooked && !isFull;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {paymentSuccess ? (
              // Success State
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </div>
            ) : paymentProcessing ? (
              // Processing State
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your payment...</p>
              </div>
            ) : (
              // Payment Form State
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
                  <button
                    onClick={closePaymentModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {paymentError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {paymentError}
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session:</span>
                      <span className="font-medium">{session.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(bookingDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{session.duration_minutes} min</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-blue-600 text-lg">${session.price}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Card Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        defaultValue="4242 4242 4242 4242"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                        readOnly
                      />
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        defaultValue="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4 text-center">
                  🔒 This is a simulated payment. No real charges will be made.
                </p>

                <button
                  onClick={processPayment}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ${session.price}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/sessions')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sessions
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Session Image */}
          <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
            {(session.image_url || session.image) ? (
              <img
                src={session.image_url || session.image}
                alt={session.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl">📚</span>
            )}
            {isFull && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                FULLY BOOKED
              </div>
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
                <Clock className="w-5 h-5" />
                <span>{session.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span className={isFull ? 'text-red-600 font-semibold' : ''}>
                  {session.current_bookings}/{session.capacity} booked
                  {!isFull && spotsAvailable > 0 && (
                    <span className="text-green-600 ml-2">({spotsAvailable} spots left)</span>
                  )}
                </span>
              </div>
              {session.start_time && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(session.start_time).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Created by</p>
              <p className="text-lg font-semibold text-gray-900">
                {session.creator_details?.name || session.creator_details?.email || 'Unknown Creator'}
              </p>
              {session.creator_details?.email && (
                <p className="text-sm text-gray-500">{session.creator_details.email}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About this session</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {session.description}
              </p>
            </div>

            {/* Booking Section */}
            {!user ? (
              <div className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-200">
                <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-gray-700 text-lg mb-4 font-semibold">
                  Please login to book this session
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login to Book
                </button>
              </div>
            ) : user.role?.toUpperCase() === 'CREATOR' ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-700">
                  You are logged in as a creator. Switch to a user account to book sessions.
                </p>
              </div>
            ) : alreadyBooked ? (
              <div className="bg-green-50 p-6 rounded-lg text-center border-2 border-green-200">
                <div className="text-6xl mb-3">✅</div>
                <p className="text-green-700 text-lg font-semibold mb-3">
                  You have already booked this session
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  View My Bookings
                </button>
              </div>
            ) : isFull ? (
              <div className="bg-red-50 p-6 rounded-lg text-center border-2 border-red-200">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <p className="text-red-700 text-lg font-semibold">
                  This session is fully booked
                </p>
                <p className="text-gray-600 mt-2">
                  Check back later or browse other sessions
                </p>
              </div>
            ) : (
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
                    onClick={handleBookClick}
                    disabled={booking || !bookingDate}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment - ${session.price}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}