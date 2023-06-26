type LangJSON = Record<string, any>

const I18N_COOKIE_NAME = 'i18n-locale'

const I18N_BROWSER_EMBEDED_KEY = '__REMIX_I18N__'

const LANG_CACHE: Record<string, LangJSON> = {}

export class Translation<T extends readonly string[]> {
  private isBrowser = typeof window !== 'undefined'

  constructor(
    private readonly allows: T,
    private readonly fallback: T[number],
    private readonly langDir = '/lang'
  ) {
    if (this.isBrowser && window[I18N_BROWSER_EMBEDED_KEY]) {
      const defaultKey = Object.keys(window[I18N_BROWSER_EMBEDED_KEY])[0]
      LANG_CACHE[defaultKey] = window[I18N_BROWSER_EMBEDED_KEY][defaultKey]
    }
  }

  getFirstMatchLang(candidates: string[]): T[number] {
    const uniqs = Array.from(new Set(candidates))
    for (let i = 0; i < uniqs.length; i++) {
      const lang = uniqs[i]
      if (lang) {
        const matched = this.allows.find((a) => a.startsWith(lang) || lang.startsWith(a))
        if (matched) {
          return matched
        }
      }
    }

    return this.fallback
  }

  getFirstLangFromServer(request: Request) {
    const url = new URL(request.url)
    const cookie = request.headers.get('cookie')
    const cookieLang = cookie?.split(';').find((c) => c.trim().startsWith(`${I18N_COOKIE_NAME}=`))
    return this.getFirstMatchLang([
      url.pathname.split('/')[1],
      cookieLang?.split('=')[1],
      ...request.headers.get('Accept-Language').split(','),
    ])
  }

  getFirstLangFromClient() {
    const cookie = document.cookie
    const cookieLang = cookie.split(';').find((c) => c.trim().startsWith(`${I18N_COOKIE_NAME}=`))
    return this.getFirstMatchLang([
      location.pathname.split('/')[1],
      cookieLang?.split('=')[1],
      ...navigator.languages,
    ])
  }

  putLangFromServer(lang: T[number], response: Response) {
    response.headers.set('Set-Cookie', `${I18N_COOKIE_NAME}=${lang}; Path=/`)
  }

  putLangFromClient(lang: T[number]) {
    document.cookie = `${I18N_COOKIE_NAME}=${lang}; Path=/`
  }

  hasTranslation(lang: T[number]) {
    return !!LANG_CACHE[lang]
  }

  getTranslation(lang: T[number]) {
    return LANG_CACHE[lang]
  }

  async fetch(lang: T[number]) {
    if (this.hasTranslation(lang)) {
      return LANG_CACHE[lang]
    }
    const response = await fetch(`${this.langDir}/${lang}.json`)
    const json = await response.json() as LangJSON
    LANG_CACHE[lang] = json
    return json
  }

  toEmbbededString() {
    return `;window.${I18N_BROWSER_EMBEDED_KEY} = ${JSON.stringify(LANG_CACHE)};`
  }
}
