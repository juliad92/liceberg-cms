import { Blocks } from '@/app/(frontend)/_components/Blocks'
import type { Page } from '@/payload-types'

interface Props {
  page: Page
}

export function PageContent({ page }: Props) {
  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Page not found.</p>
      </div>
    )
  }

  return (
    <main>
      {/* <h1>{page.title}</h1> */}
      <Blocks layout={page.layout} />
    </main>
  )
}
