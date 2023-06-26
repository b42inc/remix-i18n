import { useState, PropsWithChildren, useEffect, ReactNode } from 'react'
import { I18nContext } from '../context/I18n'
import { Translation } from '../lib/Translation'

type Props<T extends readonly string[]> = {
  locales: T
  defaultLocale: T[number]
  translation: Translation<T>
}

export function I18nProvider<T extends readonly string[]>({
  children,
  locales,
  translation,
  defaultLocale,
}: PropsWithChildren<Props<T>>): ReactNode {
  const [currentLocale, setCurrentLocale] = useState(defaultLocale)
  const [langFile, setLangfile] = useState(translation.getTranslation(defaultLocale))

  useEffect(() => {
    let isMounted = true

    translation.putLangFromClient(currentLocale)
    
    if (translation.hasTranslation(currentLocale)) {
      setLangfile(translation.getTranslation(currentLocale))
    } else {
      translation.fetch(currentLocale).then((file) => {
        if (!isMounted) {
          return
        }
        setLangfile(file)
      })
    }

    return () => {
      isMounted = false
    }
  }, [currentLocale])

  return (
    <I18nContext.Provider value={{
      currentLocale,
      setCurrentLocale,
      defaultLocale,
      locales,
      langFile,
      translation,
    } as any}>
      {children}
    </I18nContext.Provider>
  )
}
