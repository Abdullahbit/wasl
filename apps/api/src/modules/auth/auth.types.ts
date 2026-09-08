export type { Session } from './auth.service.js'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  emailVerified: boolean
}
