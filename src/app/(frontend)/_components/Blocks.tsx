import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

export function Blocks({ layout }: { layout: Page['layout'] }) {
  if (!layout || layout.length === 0) return null

  return (
    <>
      {layout.map((block, i) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <section key={i} className="mx-auto max-w-3xl px-4 py-8">
                <div className="prose-liceberg">
                  <RichText data={block.content} />
                </div>
              </section>
            )
          case 'hero':
            return (
              <section
                key={i}
                className="relative flex flex-col items-center text-center px-4 py-24"
              >
                {block.image && typeof block.image === 'object' && (
                  <img
                    src={block.image.url ?? ''}
                    alt={block.image.alt ?? ''}
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                  />
                )}
                <h1 className="text-4xl font-bold">{block.heading}</h1>
                {block.subheading && (
                  <p className="mt-4 text-lg">{block.subheading}</p>
                )}
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
