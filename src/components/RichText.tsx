// components/RichText.tsx
// Renders Payload's Lexical rich text JSON into HTML.
// Install: npm install @payloadcms/richtext-lexical

import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  content: any
  className?: string
}

export function RichText({ content, className }: Props) {
  if (!content) return null

  return (
    <PayloadRichText data={content} className={className} />

    //  <html>
    //   <main>
    //   </main>
    // </html>
  )
}
