// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { PostContent } from '@/components/PostContent'
import { getPostBySlug, getAllPostSlugs } from '@/lib/payload'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static paths at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate SEO metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.ogImage
        ? [{ url: (post.seo.ogImage as any).url }]
        : post.featuredImage
          ? [{ url: (post.featuredImage as any).url }]
          : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return <PostContent post={post} />
}
