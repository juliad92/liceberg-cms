// components/PostContent.tsx
import { RichText } from '@/components/RichText'
import Image from 'next/image'

import type { Post } from '@/payload-types'

interface Props {
  post: Post
}

export function PostContent({ post }: Props) {
  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Post not found.</p>
      </div>
    )
  }

  const {
    title,
    excerpt,
    content,
    publishedAt,
    author,
    categories,
    featuredImage,
  } = post
  const imageUrl = typeof featuredImage !== 'string' ? featuredImage?.url : null
  const imageAlt = typeof featuredImage !== 'string' ? featuredImage?.alt : ''
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="mb-4 flex gap-2">
          {categories.map((cat) => {
            // On vérifie si 'cat' est un objet (Category) et non une string (ID)
            if (typeof cat === 'string') return null

            return (
              <span
                key={cat.slug}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-..."
              >
                {cat.name}
              </span>
            )
          })}
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
      {imageUrl && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={imageAlt || 'Featured Image'}
            fill
            className="object-cover"
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
