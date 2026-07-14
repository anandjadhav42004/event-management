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
    <div 
      className={cn(
        "flex flex-col w-64 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-shrink-0 relative",
        !isOpen && "-ml-64 md:ml-0 md:w-20"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        {(!isOpen) ? (
          <span className="font-serif text-2xl font-bold text-primary tracking-widest hidden md:block">R</span>
        ) : (
          <span className="font-serif text-2xl font-bold text-primary tracking-widest">RIKA</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar">
        {nav.map((group, i) => (
          <div key={i} className="px-3">
            {(!isOpen) ? (
              <div className="h-4 hidden md:block"></div>
            ) : (
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">
                {group.label}
              </h3>
            )}
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location === item.href || location.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer group",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}>
                      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                      <span className={cn("transition-opacity", !isOpen && "md:hidden")}>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col overflow-hidden", !isOpen && "md:hidden")}>
            <span className="text-sm font-semibold truncate">{user?.name}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{user?.role}</span>
          </div>
        </div>
        <div className={cn("flex flex-col gap-2", !isOpen && "md:items-center")}>
          <Link href="/settings">
            <div className={cn("flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer", !isOpen && "md:px-0 md:justify-center w-full")}>
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className={cn(!isOpen && "md:hidden")}>Settings</span>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10", !isOpen && "md:justify-center md:px-0")}
            onClick={() => clearAuth()}
          >
            <LogOut className="h-5 w-5 mr-3 md:mr-0" />
            <span className={cn(!isOpen && "md:hidden")}>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
