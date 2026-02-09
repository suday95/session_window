'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Fetching tokens...');
        console.log('Callback page loaded, fetching tokens from backend');
        
        // Fetch JWT tokens from backend using the session created by OAuth
        const response = await fetch('http://localhost:8000/api/auth/get-tokens/', {
          method: 'GET',
          credentials: 'include', // Include cookies from the OAuth session
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (response.ok) {
          try {
            const data = JSON.parse(responseText);
            console.log('Got tokens:', { user: data.user });
            setStatus('Storing tokens...');
            
            // Store tokens and user data in localStorage
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('Tokens stored in localStorage');
            setStatus('Redirecting to home...');
            
            // Dispatch storage event to notify AuthContext
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'access_token',
              newValue: data.access,
            }));
            
            // Give a moment for the event to propagate
            setTimeout(() => {
              console.log('Redirecting to home');
              router.push('/');
            }, 500);
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            setStatus('Error parsing tokens');
            setTimeout(() => router.push('/login'), 1000);
          }
        } else {
          console.error('Failed to get tokens. Status:', response.status, 'Body:', responseText);
          setStatus(`Error: ${response.status}`);
          setTimeout(() => router.push('/login'), 1500);
        }
      } catch (error) {
        console.error('Error in callback:', error);
        setStatus(`Error: ${error.message}`);
        setTimeout(() => router.push('/login'), 1500);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
