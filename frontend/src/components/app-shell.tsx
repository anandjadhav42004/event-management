import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/lib/animations';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  React.useEffect(() => {
    console.log('[app-shell] auth state', { token, user, location });
    if (!token) {
      setLocation('/login');
    }
  }, [token, user, location, setLocation]);

  if (!token || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Preparing your workspace…</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background relative">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)' }}></div>
          <div className="relative z-10 mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                variants={pageVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
