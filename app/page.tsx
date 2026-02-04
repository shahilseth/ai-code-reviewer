'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.push('/dashboard')
        return
      }
      setChecking(false)
    }
    run()
  }, [router])

  if (checking) {
    return <div className="min-h-screen p-6">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex max-w-lg flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Code Reviewer
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Get instant feedback on your code. Sign in to start reviewing.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Login / Sign up
        </Link>
      </main>
    </div>
  )
}
