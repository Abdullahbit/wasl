/**
 * Configures server-owned authentication, sessions, and transactional auth email.
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { Resend } from 'resend';
import { environment } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { prisma } from '../../db/prisma.js';

const resend = environment.RESEND_API_KEY ? new Resend(environment.RESEND_API_KEY) : undefined;

async function sendAuthenticationEmail(recipient: string, subject: string, actionUrl: string) {
  if (!resend) {
    logger.warn({ subject }, 'Auth email skipped because RESEND_API_KEY is not configured');
    return;
  }

  const { error } = await resend.emails.send({
    from: environment.EMAIL_FROM,
    to: recipient,
    subject,
    text: `${subject}: ${actionUrl}`,
  });

  if (error) {
    throw new Error(`Resend could not send the authentication email: ${error.message}`);
  }
}

export const auth = betterAuth({
  appName: 'WASL',
  baseURL: environment.APP_URL,
  secret: environment.BETTER_AUTH_SECRET,
  trustedOrigins: [environment.APP_URL],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthenticationEmail(user.email, 'Reset your WASL password', url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthenticationEmail(user.email, 'Verify your WASL email', url);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'],
        required: false,
        defaultValue: 'USER',
        input: false,
      },
    },
  },
});
