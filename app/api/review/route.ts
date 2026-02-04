import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function mockAiReview(code: string) {
  return `
AI Code Review (Mock Mode)

✔ Readability: Good structure.
⚠ Improvements:
- Add error handling
- Improve variable naming

⭐ Overall Score: 7.5 / 10
`
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  // ✅ Get logged-in user from session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { code } = await req.json()

  if (!code) {
    return NextResponse.json(
      { error: 'Code is required' },
      { status: 400 }
    )
  }

  const feedback = mockAiReview(code)

  // ✅ Insert using auth.uid()
  const { error } = await supabase.from('code_reviews').insert({
    user_id: user.id,
    code,
    feedback,
  })

  if (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ feedback })
}
