// src/features/auth/lib/auth.ts
import { env } from '@/libs/env';
import { betterAuth } from 'better-auth';
// Import your centralized database client pool
import { db } from '@/libs/db';
import { sendPasswordResetEmail, sendWelcomeEmail } from '@/libs/email';

if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build' &&
  env.BETTER_AUTH_SECRET.startsWith('PLEASE_SET_')
) {
  console.warn(
    [
      '[auth] Missing BETTER_AUTH_SECRET.',
      'Set a 32+ char secret in your environment variables to secure sessions.',
    ].join(' '),
  );
}

const allowlistedHosts = (() => {
  const hosts = new Set<string>(['localhost:*', '*.vercel.app', '*.depeeventures.com']);

  for (const value of [env.BETTER_AUTH_URL, env.NEXT_PUBLIC_APP_URL]) {
    if (!value) continue;
    if (URL.canParse(value)) hosts.add(new URL(value).host);
  }

  return Array.from(hosts);
})();

const socialProviders =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

export const auth = betterAuth({
  // Provide your shared Neon client pool to manage user and session tables
  database: db,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: allowlistedHosts,
  emailAndPassword: {
    enabled: true,
    // Adding this method registers the POST /api/auth/forget-password endpoint
    async sendResetPassword({ user, url }) {
      console.log(`[AUTH] Sending reset email to: ${user.email}`);
      await sendPasswordResetEmail(user.email, url);
    },
  },
  socialProviders,
  user: {
    additionalFields: {
      phone: {
        type: 'string',
        required: false,
      },
      countryCode: {
        type: 'string',
        required: false,
        defaultValue: '+234',
      },
      // NDPA Audit Fields
      consentedAt: {
        type: 'string',
        required: false,
      },
      consentVersion: {
        type: 'string',
        required: false,
        defaultValue: 'NDPA-2023-V1',
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          console.log(`[AUTH] Sending welcome email to: ${user.email}`);
          await sendWelcomeEmail(user.email, user.name);
        },
      },
    },
  },
});