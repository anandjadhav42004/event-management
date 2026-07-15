import React from 'react';
import { useGetNotifications, useMarkNotificationRead } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Bell, Calendar, CreditCard, CheckSquare, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { getGetNotificationsQueryKey } from '@/api';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number) => {
    markRead.mutate(
      { id, data: { read: true } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() });
        }
      }
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'event': return <Calendar className="w-5 h-5 text-primary" />;
      case 'task': return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case 'booking': return <CheckCircle2 className="w-5 h-5 text-amber-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Notifications</h1>
          <p className="text-muted-foreground">Alerts and updates across your events.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : notifications?.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-card/20 backdrop-blur">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-1">All caught up</p>
          <p className="text-muted-foreground text-sm">You have no new notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <Card key={notification.id} className={`border-white/10 backdrop-blur transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : 'bg-card/40'}`}>
              <CardContent className="p-4 flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notification.read ? 'bg-primary/10' : 'bg-white/5'}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`text-base leading-tight ${!notification.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${!notification.read ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                    {notification.message}
                  </p>
                  
                  {!notification.read && (
                    <div className="mt-3 flex items-center gap-3">
                      <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent border-primary/30 text-primary hover:bg-primary/10" onClick={() => handleMarkRead(notification.id)}>
                        Mark as Read
                      </Button>
                      {notification.link && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-white/10" onClick={() => window.location.href = notification.link!}>
                          View Details
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
