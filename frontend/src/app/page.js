'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions/');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4 mx-auto"></div>
          <span className="text-lg text-gray-700 font-medium">Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Learn from the Best Creators
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover high-quality sessions and masterclasses taught by industry experts. Start your learning journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="inline-block px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#sessions"
                    className="inline-block px-8 py-3.5 bg-blue-700 text-white font-bold rounded-lg border-2 border-white hover:bg-blue-800 transition-all"
                  >
                    Browse Sessions
                  </Link>
                </>
              )}
              {user && (
                <Link
                  href={user.role?.toUpperCase() === 'CREATOR' ? '/creator-dashboard' : '/dashboard'}
                  className="inline-block px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold">{sessions.length}</div>
                <div className="text-blue-100 mt-2">Active Sessions</div>
              </div>
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="text-blue-100 mt-2">Happy Learners</div>
              </div>
              <div>
                <div className="text-4xl font-bold">50+</div>
                <div className="text-blue-100 mt-2">Expert Creators</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Sessions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore curated sessions from our most popular creators.</p>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4">📚</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sessions Available</h3>
            <p className="text-gray-600 text-center max-w-md">Check back soon! Our creators are preparing amazing content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <Link
                href={`/sessions/${session.id}`}
                key={session.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                  {session.image_url ? (
                    <img
                      src={session.image_url}
                      alt={session.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl opacity-30">📚</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded">
                      {session.duration} min
                    </span>
                    <span className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded">
                      ${session.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {session.description}
                  </p>

                  {/* Creator Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(session.creator_details?.first_name || session.creator_details?.username || 'C')[0].toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-gray-700">
                        {session.creator_details?.first_name || session.creator_details?.username}
                      </p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="mt-4 w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of learners mastering new skills with our platform.</p>
          {!user && (
            <Link
              href="/login"
              className="inline-block px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
