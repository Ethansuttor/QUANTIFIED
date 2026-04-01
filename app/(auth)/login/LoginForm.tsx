'use client'

import { useActionState } from 'react'
import { signInAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginForm() {
  const [error, action, pending] = useActionState(signInAction, null)

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      <Button type="submit" loading={pending} className="mt-2">
        Sign in
      </Button>
    </form>
  )
}
