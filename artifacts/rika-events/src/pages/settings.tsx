import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetMe, useUpdateUser } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, User, Lock, Bell, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey } from '@workspace/api-client-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
});

export default function SettingsPage() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const updateUser = useUpdateUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  // Update form default values when user data loads
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone || '',
      });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    updateUser.mutate(
      { id: user.id, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: 'Profile updated', description: 'Your profile details have been saved.' });
        },
        onError: () => {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
        }
      }
    );
  };

  if (userLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card/40 border-white/10 backdrop-blur text-center pt-8">
            <CardContent>
              <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary/20">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/20 uppercase tracking-widest">
                {user?.role}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start bg-white/5 border border-white/10">
              <User className="w-4 h-4 mr-2" /> Profile Details
            </Button>
            <Button variant="ghost" className="justify-start hover:bg-white/5">
              <Lock className="w-4 h-4 mr-2" /> Security
            </Button>
            <Button variant="ghost" className="justify-start hover:bg-white/5">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/40 border-white/10 backdrop-blur">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-serif">Profile Details</CardTitle>
              <CardDescription>Update your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Full Name</FormLabel>
                        <FormControl>
                          <Input className="bg-background/50 border-white/10 h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Email Address</FormLabel>
                    <Input className="bg-background/50 border-white/10 h-11 text-muted-foreground" value={user?.email || ''} disabled />
                    <FormDescription>Your email address is used for login and cannot be changed.</FormDescription>
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" className="bg-background/50 border-white/10 h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={updateUser.isPending} className="shadow-lg shadow-primary/20">
                      {updateUser.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />} 
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-white/10 backdrop-blur">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-serif">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Event Updates</div>
                  <div className="text-sm text-muted-foreground">Receive notifications when event status changes.</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Task Assignments</div>
                  <div className="text-sm text-muted-foreground">Get notified when a new task is assigned to you.</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Payment Alerts</div>
                  <div className="text-sm text-muted-foreground">Receive alerts for pending and completed payments.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
