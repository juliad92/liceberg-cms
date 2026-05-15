'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import type { Page } from '@/payload-types'
import { PageContent } from './PageContent'

export function PagePreviewClient() {
  const serverURL =
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const { data, isLoading } = useLivePreview({
    serverURL,
    depth: 2,
    initialData: {} as Page,
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

  return <PageContent page={data} />
}
