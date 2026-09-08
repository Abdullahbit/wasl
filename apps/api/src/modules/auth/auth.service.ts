import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '../../db/client.js'
import { env } from '../../config/env.js'
import { Resend } from 'resend'
import { logger } from '../../config/logger.js'

const resend = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN ?? 'http://localhost:5173', 'http://localhost:3000'],
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // allow login before verification for MVP
    sendResetPassword: async ({ user, url }: { user: { id: string; email: string }; url: string }) => {
      logger.info({ userId: user.id }, 'Sending password reset email')
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }: { user: { id: string; email: string }; url: string }) => {
      logger.info({ userId: user.id }, 'Sending email verification')
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
      })
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  advanced: {
    cookiePrefix: 'platform',
    useSecureCookies: env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      sameSite: 'lax',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false, // server-only, not user-provided
      },
    },
  },
})

export type Auth = typeof auth
export type Session = typeof auth.$Infer.Session
