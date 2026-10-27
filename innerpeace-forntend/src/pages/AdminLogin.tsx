import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format')
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { push } = useToast();
  const [showForgot, setShowForgot] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit'
  });

  const forgotForm = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    mode: 'onSubmit'
  });

  const onLogin = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      push({ type: 'success', message: 'Welcome back!' });
      const redirect = (location.state as { from?: string })?.from ?? '/admin';
      navigate(redirect, { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Invalid credentials. Please try again.';
      push({ type: 'error', message });
    }
  };

  const onForgotPassword = async (values: ForgotFormValues) => {
    try {
      await api.post('/auth/forgot-password', { email: values.email });
      setEmailSent(true);
      push({ type: 'success', message: 'Reset link sent! Check your email.' });
    } catch (err: any) {
      push({ type: 'error', message: 'Failed to send reset email. Please try again.' });
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center justify-center px-6 animate-fade-in">
      <Card className="w-full space-y-6">
        {!showForgot ? (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cocoa/70">Admin</p>
              <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
              <p className="mt-2 text-sm text-ink/70">Use your admin credentials to manage content.</p>
            </div>
            <form className="space-y-4" onSubmit={loginForm.handleSubmit(onLogin)}>
              <div className="space-y-2">
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={loginForm.formState.isSubmitting} className="w-full">
                {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-cocoa hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : emailSent ? (
          <>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold">Check your email</h1>
              <p className="text-sm text-ink/70">
                We've sent a password reset link to your email address.
                Click the link in the email to reset your password.
              </p>
              <p className="text-xs text-ink/50">
                The link will expire in 15 minutes.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowForgot(false);
                setEmailSent(false);
                forgotForm.reset();
              }}
            >
              Back to login
            </Button>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cocoa/70">Admin</p>
              <h1 className="mt-3 text-3xl font-semibold">Forgot Password</h1>
              <p className="mt-2 text-sm text-ink/70">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
            <form className="space-y-4" onSubmit={forgotForm.handleSubmit(onForgotPassword)}>
              <div className="space-y-2">
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  {...forgotForm.register('email')}
                />
                {forgotForm.formState.errors.email && (
                  <p className="text-xs text-red-600">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={forgotForm.formState.isSubmitting} className="w-full">
                {forgotForm.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-sm text-cocoa hover:underline"
              >
                Back to login
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
