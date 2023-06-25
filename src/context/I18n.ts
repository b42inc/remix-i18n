import { createContext } from 'react'

export type I18nContextProps<T extends readonly string[]> = {
  currentLocale: T[number]
  setCurrentLocale: (locale: T[number]) => void
  locales: T
  langFile: Record<string, string>
}

export const I18nContext = createContext<I18nContextProps<[]>>(null)
