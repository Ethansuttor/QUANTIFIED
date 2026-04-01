'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function signInAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirectTo: '/',
    })
    return null
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Invalid username or password'
    }
    throw error
  }
}
