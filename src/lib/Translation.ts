type LangJSON = Record<string, any>

const I18N_COOKIE_NAME = 'i18n-locale'

const I18N_BROWSER_EMBEDED_KEY = '__REMIX_I18N__'

const LANG_CACHE: Record<string, LangJSON> = {}

export type TranslationProps<T extends readonly string[]> = {
  allows: T
  fallback: T[number]
  langDir?: string
  useCookie?: boolean
}

export class Translation<T extends readonly string[]> {
  private isBrowser = typeof window !== 'undefined'
  private readonly allows: T
  private readonly fallback: T[number]
  private readonly langDir: string
  private readonly useCookie: boolean

  constructor(props: TranslationProps<T>) {
    this.allows = props.allows
    this.fallback = props.fallback
    this.langDir = props.langDir ?? '/lang'
    this.useCookie = props.useCookie ?? true

    if (
      this.isBrowser &&
      I18N_BROWSER_EMBEDED_KEY in window &&
      typeof window[I18N_BROWSER_EMBEDED_KEY] === 'object' &&
      window[I18N_BROWSER_EMBEDED_KEY]
    ) {
      Object.entries(window[I18N_BROWSER_EMBEDED_KEY]).forEach(([key, value]) => {
        LANG_CACHE[key] = value
      })
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

  private _getLangInCookie(cookie: string | null | undefined) {
    if (!this.useCookie || !cookie) {
      return ''
    }

    const cookieLang = cookie.split(';').find((c) => c.trim().startsWith(`${I18N_COOKIE_NAME}=`))
    return cookieLang?.split('=')[1].trim() || ''
  }

  getFirstLangFromServer(request: Request) {
    return this.getFirstMatchLang([
      (new URL(request.url)).pathname.split('/')[1],
      this._getLangInCookie(request.headers.get('cookie')),
      ...(request.headers.get('Accept-Language')?.split(',') ?? []),
    ])
  }

  getFirstLangFromClient() {
    return this.getFirstMatchLang([
      location.pathname.split('/')[1],
      this._getLangInCookie(document.cookie),
      ...navigator.languages,
    ])
  }

  putLangFromServer(lang: T[number], response: Response) {
    if (this.useCookie) {
      response.headers.set('Set-Cookie', `${I18N_COOKIE_NAME}=${lang}; Path=/`)
    }
  }

  putLangFromClient(lang: T[number]) {
    if (this.useCookie) {
      document.cookie = `${I18N_COOKIE_NAME}=${lang}; Path=/`
    }
  }

  getTranslation(lang: T[number]) {
    return LANG_CACHE[lang]
  }

  hasTranslation(lang: T[number]) {
    return !!this.getTranslation(lang)
  }

  async fetch(lang: T[number]) {
    const exist = this.getTranslation(lang)
    if (exist) {
      return exist
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
