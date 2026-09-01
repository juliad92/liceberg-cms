// app/posts/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/payload'
import type { Category, Media, Post } from '@/payload-types'

function getPopulatedMedia(
  media: string | Media | null | undefined
): Media | null {
  return media && typeof media !== 'string' ? media : null
}

export const metadata = {
  title: 'Blog',
  description: 'Latest articles',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-12 text-5xl font-bold tracking-tight text-gray-900">
        Blog
      </h1>

      {posts.length === 0 && (
        <p className="text-gray-500">No posts published yet.</p>
      )}

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: Post) => {
          const image = getPopulatedMedia(post.cardImage ?? post.featuredImage)

          return (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
          >
            {/* Cover image */}
            {image?.url && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt || post.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {post.categories
                    .filter((cat): cat is Category => typeof cat !== 'string')
                    .map((cat) => (
                    <span
                      key={cat.id}
                      className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="mb-2 text-xl font-semibold leading-snug text-gray-900 group-hover:text-blue-600">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                {post.author && typeof post.author !== 'string' && (
                  <span>{post.author.email}</span>
                )}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </div>
          </Link>
          )
        })}
      </div>
    </main>
  )
}
