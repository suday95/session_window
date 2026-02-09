'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4 mx-auto"></div>
          <span className="text-lg text-gray-700 font-medium">Loading amazing sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
            <span className="text-sm font-semibold text-blue-700">✨ Premium Learning Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn from the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Creators</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover high-quality sessions, masterclasses, and workshops taught by industry experts. Start your learning journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                >
                  <span>Get Started</span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link
                  href="#sessions"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <span>Browse Sessions</span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <span>Go to Dashboard</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600">{sessions.length}</div>
              <div className="text-sm text-gray-600 mt-1">Active Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">500+</div>
              <div className="text-sm text-gray-600 mt-1">Happy Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600 mt-1">Expert Creators</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Sessions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Curated sessions from our most popular creators. Start learning with world-class instruction.</p>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
            <span className="text-7xl mb-6">�</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sessions Yet</h3>
            <p className="text-lg text-gray-600 text-center max-w-md">Check back soon! Our creators are working hard to bring you amazing content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <Link
                href={`/sessions/${session.id}`}
                key={session.id}
                className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                  {session.image_url ? (
                    <img
                      src={session.image_url}
                      alt={session.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl opacity-30">📚</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {session.duration} min
                    </span>
                    <span className="bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      ${session.price}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {session.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {session.description}
                  </p>

                  {/* Creator Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(session.creator_details?.first_name || session.creator_details?.username || 'C')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {session.creator_details?.first_name || session.creator_details?.username}
                      </span>
                    </div>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Browse All Button */}
        {sessions.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
            >
              <span>Browse All Sessions</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mx-4"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Learn Something New?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of learners already mastering new skills with our platform.</p>
          {!user && (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all"
            >
              <span>Sign Up Now</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
//                     <span className="text-2xl font-bold text-blue-600">
//                       ${session.price}
//                     </span>
//                     <span className="text-gray-500">{session.duration} min</span>
//                   </div>
//                   <div className="mt-2 text-sm text-gray-500">
//                     By: {session.creator_details?.first_name || session.creator_details?.username}
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }