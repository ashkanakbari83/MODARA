import { fa } from './fa'

export type Messages = typeof fa

/** Active interface messages. Swap or extend here when more locales are added. */
export const messages: Messages = fa

/** Locale-dependent formatting settings, kept apart from business logic. */
export const localeConfig = {
  language: 'fa',
  direction: 'rtl',
  numberLocale: 'fa-IR',
  calendarLocale: 'fa-IR-u-ca-persian',
  timeZone: 'Asia/Tehran',
  /** 0 = Sunday ... 6 = Saturday. The Persian week starts on Saturday. */
  weekStartsOn: 6,
} as const
