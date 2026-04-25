import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const collection = searchParams.get('collection')
  const previewSecret = searchParams.get('secret')

  // Validate the secret
  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  if (!slug) {
    return new Response('No slug provided', { status: 400 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the post
  if (collection === 'posts') {
    redirect(`/posts/${slug}`)
  }

  redirect('/')
}
