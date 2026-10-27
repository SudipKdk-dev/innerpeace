import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { useState } from 'react';

const schema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { push } = useToast();
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onSubmit'
    });

    const onSubmit = async (values: FormValues) => {
        if (!token) {
            push({ type: 'error', message: 'Invalid reset link. Please request a new one.' });
            return;
        }

        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: values.newPassword
            });
            setSuccess(true);
            push({ type: 'success', message: 'Password reset successfully!' });
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'Failed to reset password. The link may have expired.';
            push({ type: 'error', message });
        }
    };

    if (!token) {
        return (
            <div className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center justify-center px-6 animate-fade-in">
                <Card className="w-full space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold">Invalid Link</h1>
                    <p className="text-sm text-ink/70">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button onClick={() => navigate('/admin/login')} className="w-full">
                        Back to Login
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center justify-center px-6 animate-fade-in">
            <Card className="w-full space-y-6">
                {success ? (
                    <>
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-semibold">Password Reset!</h1>
                            <p className="text-sm text-ink/70">
                                Your password has been successfully reset. You can now login with your new password.
                            </p>
                        </div>
                        <Button onClick={() => navigate('/admin/login')} className="w-full">
                            Go to Login
                        </Button>
                    </>
                ) : (
                    <>
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-cocoa/70">Admin</p>
                            <h1 className="mt-3 text-3xl font-semibold">Reset Password</h1>
                            <p className="mt-2 text-sm text-ink/70">Enter your new password below.</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-2">
                                <Input
                                    placeholder="New Password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('newPassword')}
                                />
                                {errors.newPassword && (
                                    <p className="text-xs text-red-600">{errors.newPassword.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/login')}
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
