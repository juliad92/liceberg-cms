// components/PostContent.tsx
import { RichText } from '@/components/RichText'
import Image from 'next/image'

interface Post {
  title: string
  excerpt?: string
  content: any
  publishedAt?: string
  author?: { name?: string; email: string }
  categories?: Array<{ name: string; slug: string }>
  featuredImage?: { url: string; alt: string; width: number; height: number }
}

interface Props {
  post: Post | null
}

export function PostContent({ post }: Props) {
  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Post not found.</p>
      </div>
    )
  }

  const { title, excerpt, content, publishedAt, author, categories, featuredImage } = post

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="mb-4 flex gap-2">
          {categories.map((cat) => (
            <span
              key={cat.slug}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-gray-900">
        {title}
      </h1>

      {/* Excerpt */}
      {excerpt && (
        <p className="mb-6 text-lg leading-relaxed text-gray-600">{excerpt}</p>
      )}

      {/* Meta */}
      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6 text-sm text-gray-500">
        {author && (
          <span>By {(author as any).name || (author as any).email}</span>
        )}
        {publishedAt && (
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>

      {/* Featured Image */}
      {featuredImage && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Rich Text Body */}
      <div className="prose prose-lg max-w-none">
        <RichText content={content} />
      </div>
    </article>
  )
}
