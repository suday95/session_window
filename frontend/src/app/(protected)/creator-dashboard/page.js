
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function CreatorDashboard() {
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: '',
    price: '',
    capacity: '',
    image: '',
    status: 'published',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, bookingsRes] = await Promise.all([
        api.get('/sessions/?my_sessions=true'),
        api.get('/bookings/creator_bookings/'),
      ]);
      const sessionsData = sessionsRes.data.results || sessionsRes.data;
      const bookingsData = bookingsRes.data.results || bookingsRes.data;
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        duration_minutes: parseInt(formData.duration_minutes),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        status: formData.status,
      };
      
      // Only add image if provided
      if (formData.image) {
        payload.image = formData.image;
      }

      if (editingSession) {
        await api.patch(`/sessions/${editingSession.id}/`, payload);
        alert('Session updated successfully!');
      } else {
        await api.post('/sessions/', payload);
        alert('Session created successfully!');
      }
      setShowForm(false);
      setEditingSession(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving session:', error.response?.data);
      const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : 'Unknown error';
      alert('Error saving session: ' + errorMsg);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title || '',
      description: session.description || '',
      duration_minutes: session.duration_minutes || '',
      price: session.price || '',
      capacity: session.capacity || '',
      image: session.image || '',
      status: session.status || 'published',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      await api.delete(`/sessions/${id}/`);
      alert('Session deleted successfully!');
      fetchData();
    } catch (error) {
      alert('Error deleting session');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration_minutes: '',
      price: '',
      capacity: '',
      image: '',
      status: 'published',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle session status between published and draft
  const handleToggleStatus = async (session) => {
    const newStatus = session.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/sessions/${session.id}/`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Error updating session status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Welcome, {user?.first_name || user?.username || user?.name}!
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingSession(null);
              resetForm();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {showForm ? '✕ Cancel' : '+ Create Session'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingSession ? 'Edit Session' : 'Create New Session'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Advanced React Patterns"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe what participants will learn..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    placeholder="60"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="99.99"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="10"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="published">Published (Active)</option>
                    <option value="draft">Draft (Inactive)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingSession ? 'Update Session' : 'Create Session'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">
              {sessions.length}
            </h3>
            <p className="text-gray-600">Total Sessions</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold text-green-600 mb-2">
              {bookings.length}
            </h3>
            <p className="text-gray-600">Total Bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold text-purple-600 mb-2">
              ${totalRevenue.toFixed(2)}
            </h3>
            <p className="text-gray-600">Total Revenue</p>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Sessions</h2>
          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-600">
                No sessions created yet. Create your first session!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {session.image ? (
                      <img
                        src={session.image}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {session.description}
                    </p>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                      <span className="text-2xl font-bold text-blue-600">
                        ${session.price}
                      </span>
                      <span className="text-gray-500">{session.duration_minutes} min</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleEdit(session)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    {/* Toggle Active/Inactive Button */}
                    <button
                      onClick={() => handleToggleStatus(session)}
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        session.status === 'published'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {session.status === 'published' ? '⏸ Set as Draft' : '▶ Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-gray-600">No bookings yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.session_details?.title || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.user_details?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.booked_at ? new Date(booking.booked_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600">
                            ${booking.session_details?.price || '0'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status?.toUpperCase() || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatorDashboardPage() {
  return <CreatorDashboard />;
}
































// 'use client';

// import { useState, useEffect } from 'react';
// import api from '@/lib/api';
// import { useAuth } from '@/context/AuthContext';

// function CreatorDashboard() {
//   const [sessions, setSessions] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSession, setEditingSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     duration: '',
//     price: '',
//     max_participants: '',
//     image_url: '',
//     status: 'active',
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [sessionsRes, bookingsRes] = await Promise.all([
//         api.get('/sessions/?my_sessions=true'),
//         api.get('/bookings/creator_bookings/'),
//       ]);
//       const sessionsData = sessionsRes.data.results || sessionsRes.data;
//       const bookingsData = bookingsRes.data.results || bookingsRes.data;
//       setSessions(Array.isArray(sessionsData) ? sessionsData : []);
//       setBookings(Array.isArray(bookingsData) ? bookingsData : []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingSession) {
//         await api.patch(`/sessions/${editingSession.id}/`, formData);
//         alert('Session updated successfully!');
//       } else {
//         await api.post('/sessions/', formData);
//         alert('Session created successfully!');
//       }
//       setShowForm(false);
//       setEditingSession(null);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       alert('Error saving session: ' + (error.response?.data?.detail || 'Unknown error'));
//     }
//   };

//   const handleEdit = (session) => {
//     setEditingSession(session);
//     setFormData(session);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this session?')) return;

//     try {
//       await api.delete(`/sessions/${id}/`);
//       alert('Session deleted successfully!');
//       fetchData();
//     } catch (error) {
//       alert('Error deleting session');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       duration: '',
//       price: '',
//       max_participants: '',
//       image_url: '',
//       status: 'active',
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading dashboard...</div>
//       </div>
//     );
//   }

//   const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount), 0);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900">Creator Dashboard</h1>
//             <p className="text-lg text-gray-600 mt-2">
//               Welcome, {user?.first_name || user?.username}!
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               setEditingSession(null);
//               resetForm();
//             }}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//           >
//             {showForm ? '✕ Cancel' : '+ Create Session'}
//           </button>
//         </div>

//         {/* Create/Edit Form */}
//         {showForm && (
//           <div className="bg-white rounded-lg shadow-md p-8 mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               {editingSession ? 'Edit Session' : 'Create New Session'}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Session Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="e.g., Advanced React Patterns"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Describe what participants will learn..."
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                   rows="5"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Duration (minutes) *
//                   </label>
//                   <input
//                     type="number"
//                     name="duration"
//                     placeholder="60"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     required
//                     min="1"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price ($) *
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     placeholder="99.99"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                     step="0.01"
//                     min="0"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Max Participants *
//                   </label>
//                   <input
//                     type="number"
//                     name="max_participants"
//                     placeholder="10"
//                     value={formData.max_participants}
//                     onChange={handleChange}
//                     required
//                     min="1"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status *
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Image URL (optional)
//                 </label>
//                 <input
//                   type="url"
//                   name="image_url"
//                   placeholder="https://example.com/image.jpg"
//                   value={formData.image_url}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 {editingSession ? 'Update Session' : 'Create Session'}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-3xl font-bold text-blue-600 mb-2">
//               {sessions.length}
//             </h3>
//             <p className="text-gray-600">Total Sessions</p>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-3xl font-bold text-green-600 mb-2">
//               {bookings.length}
//             </h3>
//             <p className="text-gray-600">Total Bookings</p>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-3xl font-bold text-purple-600 mb-2">
//               ${totalRevenue.toFixed(2)}
//             </h3>
//             <p className="text-gray-600">Total Revenue</p>
//           </div>
//         </div>

//         {/* Sessions Grid */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">My Sessions</h2>
//           {sessions.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-12 text-center">
//               <div className="text-6xl mb-4">📚</div>
//               <p className="text-xl text-gray-600">
//                 No sessions created yet. Create your first session!
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {sessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
//                     {session.image_url ? (
//                       <img
//                         src={session.image_url}
//                         alt={session.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-6xl">📚</span>
//                     )}
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       {session.title}
//                     </h3>
//                     <p className="text-gray-600 mb-4 line-clamp-2">
//                       {session.description}
//                     </p>
//                     <div className="flex justify-between items-center mb-4 pb-4 border-b">
//                       <span className="text-2xl font-bold text-blue-600">
//                         ${session.price}
//                       </span>
//                       <span className="text-gray-500">{session.duration} min</span>
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${session.status === 'active'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-gray-100 text-gray-800'
//                         }`}>
//                         {session.status.toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleEdit(session)}
//                         className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(session.id)}
//                         className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Recent Bookings Table */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
//           {bookings.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-12 text-center">
//               <div className="text-6xl mb-4">📅</div>
//               <p className="text-xl text-gray-600">No bookings yet.</p>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Session
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {bookings.map((booking) => (
//                       <tr key={booking.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {booking.session_details?.title}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {booking.user_details?.email}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {new Date(booking.booking_date).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-semibold text-blue-600">
//                             ${booking.amount}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-gray-100 text-gray-800'
//                             }`}>
//                             {booking.status.toUpperCase()}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CreatorDashboardPage() {
//   return <CreatorDashboard />;
// }