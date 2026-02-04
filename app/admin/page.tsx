'use client';

import { Suspense } from 'react';
import AdminContent from './admin-content';

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-medium text-muted-foreground">Loading admin...</p>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}