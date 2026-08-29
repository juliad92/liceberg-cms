import type { Block } from 'payload'

export const TitleBlock: Block = {
  slug: 'title',
  labels: { singular: 'Title', plural: 'Titles' },
  fields: [{ name: 'text', type: 'text', required: true }],
}
