import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { RefreshRouteOnSave } from '../_components/RefreshRouteOnSave'
import { PageContent } from '@/components/PageContent'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params // params are async in Next.js 15+
  const { isEnabled: isDraft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: isDraft, // serve draft content when in preview
    overrideAccess: isDraft, // ou true
    where: {
      slug: { equals: slug ?? 'home' },
    },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return notFound()

  return (
    <>
      {isDraft && <RefreshRouteOnSave />}
      <PageContent page={page} />
    </>
  )
}
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({ collection: 'pages', limit: 100 })
  console.log(
    'Pages found:',
    pages.docs.map((p) => p.slug)
  )

  return pages.docs
    .filter(({ slug }) => typeof slug === 'string' && slug.length > 0)
    .map(({ slug }) => ({ slug }))
}
