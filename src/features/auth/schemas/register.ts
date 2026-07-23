// src/features/auth/schemas/register.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').trim(),
    countryCode: z.string().min(1, 'Country code is required'),
    phone: z
      .string()
      .min(7, 'Please enter a valid phone number')
      .max(15, 'Phone number is too long'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;