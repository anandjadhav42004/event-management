import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/use-auth-store';
import { 
  LayoutDashboard, Calendar, Users, Building, 
  DollarSign, CheckSquare, Package, Speaker,
  Settings, LogOut, FileText, ClipboardList, BookOpen
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariantsX } from '@/lib/animations';

interface SidebarProps {
  isOpen: boolean;
  userRole: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function Sidebar({ isOpen, userRole }: SidebarProps) {
  const [location] = useLocation();
  const { user, clearAuth } = useAuthStore();

  const isClient = userRole === 'client';

  const clientNav: NavGroup[] = [
    {
      label: 'My Event',
      items: [
        { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', href: '/client/bookings', icon: BookOpen },
        { name: 'Guests', href: '/client/guests', icon: Users },
        { name: 'Tasks', href: '/client/tasks', icon: CheckSquare },
      ]
    }
  ];

  const adminNav: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'Events',
      items: [
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Inquiries', href: '/inquiries', icon: FileText },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
      ]
    },
    {
      label: 'Operations',
      items: [
        { name: 'Venues', href: '/venues', icon: Building },
        { name: 'Rooms', href: '/rooms', icon: Building },
        { name: 'Inventory', href: '/inventory', icon: Package },
      ]
    },
    {
      label: 'Catalog',
      items: [
        { name: 'Vendors', href: '/vendors', icon: Users },
        { name: 'Decor', href: '/decor', icon: Package },
        { name: 'Anchors / MC', href: '/anchors', icon: Speaker },
      ]
    },
    {
      label: 'Finance',
      items: [
        { name: 'Bookings', href: '/bookings', icon: BookOpen },
        { name: 'Quotations', href: '/quotations', icon: ClipboardList },
        { name: 'Payments', href: '/payments', icon: DollarSign },
      ]
    },
    {
      label: 'People',
      items: [
        { name: 'Guests', href: '/guests', icon: Users },
        { name: 'Users', href: '/users', icon: Users },
      ]
    }
  ];

  const nav = isClient ? clientNav : adminNav;

  return (
    <motion.div
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full bg-sidebar border-r border-sidebar-border flex-shrink-0 relative overflow-hidden"
      style={{ minWidth: isOpen ? 256 : 80 }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-serif text-2xl font-bold text-primary tracking-widest"
            >
              RIKA
            </motion.span>
          ) : (
            <motion.span
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-serif text-2xl font-bold text-primary tracking-widest"
            >
              R
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav groups */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar"
      >
        {nav.map((group, i) => (
          <div key={i} className="px-3">
            <AnimatePresence>
              {isOpen && (
                <motion.h3
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans"
                >
                  {group.label}
                </motion.h3>
              )}
            </AnimatePresence>
            {!isOpen && <div className="h-4 hidden md:block"></div>}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.href || location.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      variants={itemVariantsX}
                      whileHover={{ x: 2, backgroundColor: 'hsl(var(--sidebar-accent) / 0.7)' }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium cursor-pointer group relative',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground'
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-full"
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        />
                      )}
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                        )} />
                      </motion.div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.18 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }}>
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-sm font-semibold truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{user?.role}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={cn('flex flex-col gap-2', !isOpen && 'md:items-center')}>
          <Link href="/settings">
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer',
                !isOpen && 'md:px-0 md:justify-center w-full'
              )}
            >
              <motion.div whileHover={{ rotate: 45 }} transition={{ duration: 0.3 }}>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              !isOpen && 'md:justify-center md:px-0'
            )}
            onClick={() => clearAuth()}
          >
            <LogOut className="h-5 w-5 mr-3 md:mr-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
