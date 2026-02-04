'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleReset() {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password updated successfully 🎉')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl mb-4">Reset Password</h1>
      <input
        type="password"
        placeholder="New password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="mt-4 w-full bg-black text-white p-2"
      >
        Update Password
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}
