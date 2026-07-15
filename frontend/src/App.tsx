import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import React, { useEffect } from 'react';
import LandingPage from '@/pages/landing';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import { AppShell } from '@/components/app-shell';

// Dashboard & Analytics
import DashboardPage from '@/pages/dashboard';
import ClientDashboardPage from '@/pages/client/dashboard';

// Events & Planning
import EventsPage from '@/pages/events';
import EventDetailPage from '@/pages/events/[id]';
import InquiriesPage from '@/pages/inquiries';
import TasksPage from '@/pages/tasks';
import ClientTasksPage from '@/pages/client/tasks';

// People & Users
import GuestsPage from '@/pages/guests';
import ClientGuestsPage from '@/pages/client/guests';
import VendorsPage from '@/pages/vendors';
import UsersPage from '@/pages/users';
import AnchorsPage from '@/pages/anchors';

// Operations & Catalog
import VenuesPage from '@/pages/venues';
import RoomsPage from '@/pages/rooms';
import DecorPage from '@/pages/decor';
import InventoryPage from '@/pages/inventory';

// Financials
import BookingsPage from '@/pages/bookings';
import ClientBookingsPage from '@/pages/client/bookings';
import QuotationsPage from '@/pages/quotations';
import PaymentsPage from '@/pages/payments';

// Supporting
import SettingsPage from '@/pages/settings';
import NotificationsPage from '@/pages/notifications';
import GalleryPage from '@/pages/gallery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App crash:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-lg rounded-xl border border-destructive/30 bg-card p-6 text-center">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">{this.state.error.message}</p>
            <pre className="mt-4 overflow-auto rounded bg-background/70 p-3 text-left text-xs">{this.state.error.stack}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/gallery" component={GalleryPage} />
      
      {/* Protected Routes inside App Shell */}
      <Route path="/:rest*">
        <AppShell>
          <Switch>
            <Route path="/dashboard" component={DashboardPage} />
            
            <Route path="/events" component={EventsPage} />
            <Route path="/events/:id" component={EventDetailPage} />
            <Route path="/inquiries" component={InquiriesPage} />
            <Route path="/tasks" component={TasksPage} />
            
            <Route path="/guests" component={GuestsPage} />
            <Route path="/vendors" component={VendorsPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/anchors" component={AnchorsPage} />
            
            <Route path="/venues" component={VenuesPage} />
            <Route path="/rooms" component={RoomsPage} />
            <Route path="/decor" component={DecorPage} />
            <Route path="/inventory" component={InventoryPage} />
            
            <Route path="/bookings" component={BookingsPage} />
            <Route path="/quotations" component={QuotationsPage} />
            <Route path="/payments" component={PaymentsPage} />
            
            <Route path="/notifications" component={NotificationsPage} />
            <Route path="/settings" component={SettingsPage} />

            {/* Client Portal */}
            <Route path="/client/dashboard" component={ClientDashboardPage} />
            <Route path="/client/bookings" component={ClientBookingsPage} />
            <Route path="/client/guests" component={ClientGuestsPage} />
            <Route path="/client/tasks" component={ClientTasksPage} />
            
            <Route component={NotFound} />
          </Switch>
        </AppShell>
      </Route>
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
