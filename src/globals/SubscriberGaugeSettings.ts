import type { GlobalConfig } from 'payload'

export const SUBSCRIBER_GAUGE_EDITOR_EMAIL = 'jdemichel.jd@gmail.com'

export function canManageSubscriberGauge({
  req,
}: {
  req: { user?: { email?: string } | null }
}) {
  return req.user?.email?.trim().toLowerCase() === SUBSCRIBER_GAUGE_EDITOR_EMAIL
}

export const SubscriberGaugeSettings: GlobalConfig = {
  slug: 'subscriber-gauge-settings',
  label: 'Jauge des abonnés',
  access: {
    read: canManageSubscriberGauge,
    update: canManageSubscriberGauge,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Afficher la jauge sur le site',
      defaultValue: true,
      access: {
        read: canManageSubscriberGauge,
        update: canManageSubscriberGauge,
      },
    },
    {
      name: 'goal',
      type: 'number',
      label: 'Objectif d’abonnés',
      required: true,
      min: 1,
      validate: (value: unknown) =>
        Number.isInteger(value) || 'L’objectif doit être un nombre entier.',
      defaultValue: 1000,
      access: {
        read: canManageSubscriberGauge,
        update: canManageSubscriberGauge,
      },
    },
    {
      name: 'deadline',
      type: 'date',
      label: 'Date limite',
      required: true,
      defaultValue: '2026-12-30T22:59:59.000Z',
      admin: {
        description:
          'Date et heure de fin de la campagne, affichées dans le décompte.',
      },
      access: {
        read: canManageSubscriberGauge,
        update: canManageSubscriberGauge,
      },
    },
  ],
}

export default SubscriberGaugeSettings
