'use client'

// components/PostPreviewClient.tsx
//
// This is the client component rendered inside Payload's Live Preview iframe.
// `useLivePreview` subscribes to window.postMessage events from the Payload admin
// and provides the latest document data without any network round-trip.
//
// The flow:
//  1. Editor edits a field in Payload admin
//  2. Payload emits postMessage({ data: <full document> })
//  3. useLivePreview picks it up and updates `data` in React state
//  4. PostContent re-renders instantly with the new values

import { useLivePreview } from '@payloadcms/live-preview-react'
import { PostContent } from './PostContent'

interface Props {
  slug: string
}

export function PostPreviewClient({ slug }: Props) {
  const serverURL =
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // `initialData` can be empty — Payload will push the full document
  // as soon as the iframe signals it is ready.
  const { data, isLoading } = useLivePreview({
    serverURL: 'http://localhost:3000',
    depth: 2,
    initialData: {} as any,
  })

  if (isLoading || !data?.title) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="text-sm">Waiting for Live Preview data…</span>
        </div>
      </div>
    )
  }

  return <PostContent post={data} />
}
