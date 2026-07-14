import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useLocation } from 'wouter';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  React.useEffect(() => {
    if (!token) {
      setLocation('/login');
    }
  }, [token, setLocation]);

  if (!token || !user) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background relative">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)' }}></div>
          <div className="relative z-10 mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
