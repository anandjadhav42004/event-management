import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetNotifications } from '@workspace/api-client-react';
import { Link } from 'wouter';

interface TopbarProps {
  toggleSidebar: () => void;
}

export function Topbar({ toggleSidebar }: TopbarProps) {
  const { data: notifications } = useGetNotifications({ unreadOnly: true });
  const unreadCount = notifications?.length || 0;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search events, clients, vendors..." 
            className="w-full bg-background border-border pl-9 rounded-full h-9 focus-visible:ring-primary/50 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
