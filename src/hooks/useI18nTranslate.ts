import { useI18n } from './useI18n'
import { useCallback } from 'react'

type Keys = keyof RemixI18nTranslations

type Args = RemixI18nTranslations[Keys]

type NoRecordKeys = {
  [K in Keys]: RemixI18nTranslations[K] extends Record<string, any> ? never : K
}[Keys]

type RecordKeys = Exclude<Keys, NoRecordKeys>

export const useI18nTranslate = () => {
  const { langFile } = useI18n()
  const translate = useCallback((key: Keys, args?: Args): string => {
    const template = langFile[key] || ''

    if (!args) {
      return template
    }

    return Object.entries(args).reduce(
      (str, [arg, value]) => str.replace(new RegExp(`{${arg}}`, 'g'), value),
      template
    )
  }, [langFile]) as {
    (key: NoRecordKeys): string
    <K extends RecordKeys>(key: K, args: RemixI18nTranslations[K]): string
  }

  return translate
}
