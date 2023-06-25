import { useI18n } from './useI18n'
import { useCallback } from 'react'

export type RemixI18nTranslationKeys = keyof RemixI18nTranslations

export type RemixI18nTranslationArgs = RemixI18nTranslations[RemixI18nTranslationKeys]

export type RemixI18nTranslationTextKeys = {
  [K in RemixI18nTranslationKeys]: RemixI18nTranslations[K] extends Record<string, any> ? never : K
}[RemixI18nTranslationKeys]

export type RemixI18nTranslationHasArgsKeys = Exclude<RemixI18nTranslationKeys, RemixI18nTranslationTextKeys>

export const useI18nTranslate = () => {
  const { langFile } = useI18n()
  const translate = useCallback((key: RemixI18nTranslationKeys, args?: RemixI18nTranslationArgs): string => {
    const template = langFile[key] || ''

    if (!args) {
      return template
    }

    return Object.entries(args).reduce(
      (str, [arg, value]) => str.replace(new RegExp(`{${arg}}`, 'g'), value),
      template
    )
  }, [langFile]) as {
    (key: RemixI18nTranslationTextKeys): string
    (key: RemixI18nTranslationHasArgsKeys, args: RemixI18nTranslations[RemixI18nTranslationHasArgsKeys]): string
  }

  return translate
}
