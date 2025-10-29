'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#2C3E50',
          border: '1px solid #E5E7EB',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        success: {
          iconTheme: {
            primary: '#5CB85C',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#D9534F',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
