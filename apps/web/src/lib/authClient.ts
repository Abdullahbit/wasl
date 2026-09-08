/**
 * Exposes Better Auth browser helpers while keeping session cookies HTTP-only.
 */

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({ baseURL: window.location.origin });
