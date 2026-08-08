// src/features/auth/components/password-reset-form.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authClient } from '@/features/auth/lib/auth-client';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export default function PasswordResetForm() {
  const t = useTranslations('auth.passwordReset');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const emailError = form.formState.errors.email?.message;

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMsg(null);
    try {
      const res = await (authClient as any).forgetPassword({
        email: values.email,
        redirectTo: '/password-reset',
      });

      if (res?.error) {
        setErrorMsg(res.error.message || 'Failed to request password reset.');
      } else {
        setSubmitted(true);
        toast.success('Reset link sent to your email.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="text-sm text-muted-foreground">{t('submitted')}</p>
          ) : (
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="email@example.com"
                  aria-invalid={!!emailError}
                  {...form.register('email')}
                />
                <InputError message={emailError} />
              </div>

              {errorMsg && (
                <p className="text-xs text-destructive">{errorMsg}</p>
              )}

              <Button type="submit" loading={form.formState.isSubmitting}>
                {t('submit')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}