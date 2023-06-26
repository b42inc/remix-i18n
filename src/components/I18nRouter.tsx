import { FC, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useLocation, useNavigate, useParams } from '@remix-run/react'

type Props = {
  // Default: false. If true, listens to the 'languagechange' event and switches languages automatically.
  enableLanguageChange?: boolean,
  // Default: false. If true, adopts routes that start with /${lang}/.
  enableLanguageRoute?: boolean,
  // Default: false. If true, enforces adoption of routes that start with /${lang}/.
  enforceLanguageRoute?: boolean,
}

const I18nRouter: FC<Props> = ({
  enableLanguageChange,
  enableLanguageRoute,
  enforceLanguageRoute,
}) => {
  const { lang: langParam } = useParams()
  const currentLocation = useLocation()
  const navigate = useNavigate()
  const { translation, currentLocale, setCurrentLocale, defaultLocale } = useI18n()
  
  useEffect(() => {
    function onLanguageChange() {
      const newLocale = translation.getFirstMatchLang([
        ...navigator.languages,
      ])
      setCurrentLocale(newLocale)
    }

    if (enableLanguageChange) {
      window.addEventListener('languagechange', onLanguageChange)
    }

    return () => {
      window.removeEventListener('languagechange', onLanguageChange)
    }
  }, [enableLanguageChange, translation])

  useEffect(() => {
    if (!enableLanguageRoute) {
      return
    }

    const currentPathname = currentLocation.pathname
    const langRegx = new RegExp(`^\/${langParam}(\/|$)`);
    let pathname: string

    if (currentLocale === defaultLocale && !enforceLanguageRoute) {
      pathname = langParam
        ? currentPathname.replace(langRegx, '$1')
        : currentPathname
    } else {
      pathname = langParam
        ? currentPathname.replace(langRegx, `/${currentLocale}$1`)
        : `/${currentLocale}${currentPathname}`
    }

    if (pathname === currentPathname) {
      return
    }

    navigate({
      ...currentLocation,
      pathname,
    })
  }, [
    enableLanguageRoute,
    enforceLanguageRoute,
    currentLocation,
    langParam,
    currentLocale,
    defaultLocale,
    navigate,
  ])

  return null
}

export default I18nRouter