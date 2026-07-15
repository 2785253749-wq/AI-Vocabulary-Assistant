'use client';

import ToastContainer from '@/components/Toast';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}
