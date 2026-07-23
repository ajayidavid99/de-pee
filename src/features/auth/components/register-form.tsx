'use client';

import TextLink from '@/components/shared/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/auth-provider';
import { registerSchema, type RegisterInput } from '../schemas/register';

const countryCodes = [
  { label: '🇳🇬 Nigeria (+234)', value: '+234' },
  { label: '🇬🇭 Ghana (+233)', value: '+233' },
  { label: '🇰🇪 Kenya (+254)', value: '+254' },
  { label: '🇬🇧 UK (+44)', value: '+44' },
  { label: '🇺🇸 USA (+1)', value: '+1' },
];

const RegisterForm = () => {
  const t = useTranslations('auth.register');
  const tLogin = useTranslations('auth.login');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { signUp, user, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      countryCode: '+234',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signUp({
        email: values.email,
        password: values.password,
        name: values.name,
        // Send extra fields directly to BetterAuth signUp
        phone: values.phone,
        countryCode: values.countryCode,
      } as any);
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : t('signUpFailed'),
      );
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div>{tCommon('loading')}</div>
      </div>
    );
  }

  if (user) return null;

  const errors = form.formState.errors;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:gap-6" onSubmit={onSubmit} noValidate>
            <div className="grid gap-4 sm:gap-6">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  placeholder={t('namePlaceholder')}
                  aria-invalid={!!errors.name}
                  {...form.register('name')}
                />
                <InputError message={errors.name?.message} />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">{tLogin('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.com"
                  aria-invalid={!!errors.email}
                  {...form.register('email')}
                />
                <InputError message={errors.email?.message} />
              </div>

              {/* Country Code & Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Controller
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[110px] text-xs">
                          <SelectValue placeholder="+234" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((c) => (
                            <SelectItem key={c.value} value={c.value} className="text-xs">
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="8012345678"
                    className="flex-1 text-xs"
                    aria-invalid={!!errors.phone}
                    {...form.register('phone')}
                  />
                </div>
                <InputError message={errors.phone?.message} />
              </div>

              {/* Passwords */}
              <div className="grid gap-2">
                <Label htmlFor="password">{tLogin('password')}</Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  placeholder={t('passwordPlaceholder')}
                  aria-invalid={!!errors.password}
                  {...form.register('password')}
                />
                <InputError message={errors.password?.message} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  aria-invalid={!!errors.confirmPassword}
                  {...form.register('confirmPassword')}
                />
                <InputError message={errors.confirmPassword?.message} />
              </div>

              {serverError && (
                <p className="text-sm text-destructive" role="alert">
                  {serverError}
                </p>
              )}

              <Button type="submit" loading={form.formState.isSubmitting}>
                {t('submit')}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('haveAccount')}{' '}
            <TextLink href="/login" className="text-primary">
              {tLogin('title')}
            </TextLink>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;