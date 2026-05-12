'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
