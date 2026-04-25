// app/posts/preview/[slug]/page.tsx
// This page is loaded inside Payload's Live Preview iframe.
//
// Must be dynamic (never statically pre-rendered).
// Data arrives via postMessage — no API fetch needed.

export const dynamic = 'force-dynamic'

import { PostPreviewClient } from '@/components/PostPreviewClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PostPreviewPage({ params }: Props) {
  const { slug } = await params

  // Pass slug to the client component so useLivePreview can initialise.
  // The actual post data streams in through Payload's postMessage events.
  return <PostPreviewClient slug={slug} />
}
