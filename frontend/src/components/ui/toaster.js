import { useEffect } from 'react';

export default function Toaster({ message, type = 'error', onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      background: type === 'error' ? '#fee2e2' : '#d1fae5',
      color: type === 'error' ? '#991b1b' : '#065f46',
      border: '1px solid #fca5a5',
      borderRadius: 8,
      padding: '1rem 2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontWeight: 500,
      minWidth: 200,
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
}
