'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      if (error.message.toLowerCase().includes('invalid')) {
        setShowForgot(true)
      }
    } else {
      setShowForgot(false)
      router.push('/dashboard')
      router.refresh()
    }

    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email to confirm signup 📧')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 p-6 border rounded space-y-4">
        <h1 className="text-xl font-bold">Login / Signup</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white p-2"
        >
          Login
        </button>

        {showForgot === true && (
          <button
            onClick={async () => {
              if (!email.trim()) {
                alert('Enter your email first.')
                return
              }

              const { error } =
                await supabase.auth.resetPasswordForEmail(email)
              if (error) {
                alert(error.message)
                return
              }

              alert('Password reset email sent. Check your inbox (and spam).')
            }}
            className="text-sm underline"
            type="button"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full border p-2"
        >
          Sign Up
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm">{message}</p>}
      </div>
    </div>
  )
}
