import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRegisterUser } from "@/api";
import { useAuthStore } from '@/hooks/use-auth-store';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['admin', 'organizer', 'client', 'vendor']),
  phone: z.string().optional(),
});

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const registerMutation = useRegisterUser();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'organizer',
      phone: '',
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    // The API expects specific roles
    registerMutation.mutate(
      { data: values as any }, // Type casting to bypass strict RegisterInputRole type mismatch for simplicity here
      {
        onSuccess: (data) => {
          setAuth(data.token, data.user);
          toast({
            title: 'Account created',
            description: 'Welcome to VivahVerse.',
          });
          
          if (data.user.role === 'client') {
            setLocation('/client/dashboard');
          } else {
            setLocation('/dashboard');
          }
        },
        onError: (error: any) => {
          toast({
            variant: 'destructive',
            title: 'Registration failed',
            description: error?.message || 'Please check your inputs and try again.',
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center premium-gradient-bg py-12 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-pink-100/50 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-amber-100/50 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-primary/20 rounded-full animate-sparkle"></div>
        <div className="absolute bottom-[20%] right-[15%] w-3 h-3 bg-amber-400/30 rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10 animate-fade-in"
      >
        <div className="mb-8 text-center">
          <Link href="/">
            <div className="inline-block font-serif text-4xl font-bold tracking-widest text-transparent bg-clip-text premium-button-gradient cursor-pointer mb-6">VivahVerse</div>
          </Link>
          <h1 className="text-4xl font-serif font-medium mb-3 text-foreground">Create Unforgettable Weddings</h1>
          <p className="text-muted-foreground font-sans text-lg">Join the elite network of event professionals</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-primary/10 p-8 rounded-3xl premium-shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-background/50 border-white/10 h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@company.com" className="bg-background/50 border-white/10 h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" className="bg-background/50 border-white/10 h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10 h-11">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="organizer">Event Organizer / Planner</SelectItem>
                        <SelectItem value="admin">Platform Administrator</SelectItem>
                        <SelectItem value="vendor">Vendor / Supplier</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-background/50 border-white/10 h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 text-lg rounded-xl premium-button-gradient border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 mt-4" 
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login">
            <span className="text-primary hover:underline cursor-pointer font-medium">Sign in</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
