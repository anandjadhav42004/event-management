import React, { useState } from 'react';
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
import { useLoginUser } from "@/api";
import { useAuthStore } from '@/hooks/use-auth-store';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const loginMutation = useLoginUser();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          setAuth(data.token, data.user);
          toast({
            title: 'Welcome back',
            description: 'You have successfully signed in.',
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
            title: 'Sign in failed',
            description: error?.message || 'Please check your credentials and try again.',
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center premium-gradient-bg p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-pink-100/50 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-amber-100/50 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[20%] w-4 h-4 bg-primary/20 rounded-full animate-sparkle"></div>
        <div className="absolute bottom-[30%] left-[15%] w-3 h-3 bg-amber-400/30 rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 animate-fade-in"
      >
        <div className="mb-10 text-center">
          <Link href="/">
            <div className="inline-block font-serif text-4xl font-bold tracking-widest text-transparent bg-clip-text premium-button-gradient cursor-pointer mb-6">VivahVerse</div>
          </Link>
          <h1 className="text-4xl font-serif font-medium mb-3 text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground font-sans text-lg">Continue planning your perfect day</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-primary/10 p-8 rounded-3xl premium-shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@company.com" 
                        className="bg-background/50 border-white/10 h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Password</FormLabel>
                      <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-background/50 border-white/10 h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-14 text-lg rounded-xl premium-button-gradient border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register">
            <span className="text-primary hover:underline cursor-pointer font-medium">Request access</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
