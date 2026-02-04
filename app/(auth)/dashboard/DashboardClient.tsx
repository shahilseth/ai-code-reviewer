'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
      } else {
        setEmail(data.user.email ?? null)
      }

      setLoading(false)
    }

    getUser()
  }, [router])

  const submitForReview = async () => {
    if (!code.trim()) return

    setSubmitting(true)
    setFeedback('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const res = await fetch('/api/review', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        userId: user?.id,
      }),
    })

    const data = await res.json()

    if (data.error) {
      setFeedback(`Error: ${data.error}`)
    } else {
      setFeedback(data.feedback)
    }

    setSubmitting(false)
  }

  if (loading) {
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Code Reviewer</h1>
        <button
          className="border px-3 py-1"
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
          }}
        >
          Logout
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Logged in as {email}
      </p>

      <textarea
        className="w-full mt-6 border p-3 h-48"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="mt-4 bg-black text-white px-4 py-2"
        onClick={submitForReview}
        disabled={submitting}
      >
        {submitting ? 'Reviewing...' : 'Review Code'}
      </button>

      {feedback && (
        <div className="mt-6 border p-4 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">AI Feedback</h2>
          {feedback}
        </div>
      )}
    </div>
  )
}
