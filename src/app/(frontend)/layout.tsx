import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'white', color: '#1a1a1a' }}>
      <main>{children}</main>
      {/* <Analytics /> */}
    </div>
  )
}
