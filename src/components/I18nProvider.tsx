import { useState, PropsWithChildren, useEffect, ReactNode } from 'react'
import { I18nContext } from '../context/I18n'
import { Language } from '../lib/Language'

type Props<T extends readonly string[]> = {
  locales: T
  defaultLocale: T[number]
  lang: Language<T>
}

export function I18nProvider<T extends readonly string[]>({ children, locales, lang, defaultLocale }: PropsWithChildren<Props<T>>): ReactNode {
  const [currentLocale, setCurrentLocale] = useState(defaultLocale)
  const [langFile, setLangfile] = useState(lang.getTranslation(defaultLocale))

  useEffect(() => {
    let isMounted = true
    lang.putKeyFromClient(currentLocale)
    
    if (lang.hasTranslation(currentLocale)) {
      setLangfile(lang.getTranslation(currentLocale))
    } else {
      lang.fetchTranslation(currentLocale).then((file) => {
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
      locales,
      langFile,
    } as any}>
      {children}
    </I18nContext.Provider>
  )
}
