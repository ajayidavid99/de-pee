// src/features/auth/components/profile-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/features/auth/lib/auth-client';
import { toast } from 'sonner';
import { User, Lock, ShieldCheck, Mail } from 'lucide-react';

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsUpdatingName(true);
    try {
      const res = await authClient.updateUser({ name });
      if (res.error) {
        toast.error(res.error.message || 'Failed to update profile.');
      } else {
        toast.success('Profile details updated successfully.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (res.error) {
        toast.error(res.error.message || 'Failed to change password.');
      } else {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error('An error occurred while changing password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Account Info Form */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold">Personal Information</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Manage your account identity details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <div className="relative">
                <Input
                  value={user.email}
                  disabled
                  className="h-9 text-xs bg-muted/50 cursor-not-allowed pr-8"
                />
                <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Email changes are restricted for verification integrity.
              </p>
            </div>

            {user.role && (
              <div className="space-y-1.5">
                <Label className="text-xs">Assigned Access Role</Label>
                <div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" disabled={isUpdatingName} className="h-8 text-xs font-bold">
                {isUpdatingName ? 'Saving...' : 'Save Profile Details'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Form */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base font-bold">Security Settings</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Update your authentication password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" variant="outline" disabled={isUpdatingPassword} className="h-8 text-xs font-bold">
                {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}