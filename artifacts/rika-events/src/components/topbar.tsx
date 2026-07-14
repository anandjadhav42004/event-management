import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetNotifications } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
  toggleSidebar: () => void;
}

export function Topbar({ toggleSidebar }: TopbarProps) {
  const { data: notifications } = useGetNotifications({ unreadOnly: true });
  const unreadCount = notifications?.length || 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40"
    >
      <div className="flex items-center gap-4">
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>

        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events, clients, vendors..."
            className="w-full bg-background border-border pl-9 rounded-full h-9 focus-visible:ring-primary/50 text-sm transition-all duration-200 focus:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/notifications">
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                    className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-background"
                  />
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.header>
  );
}
