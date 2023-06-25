type LangJSON = Record<string, any>

const COOKIE_NAME = 'i18n-locale'

const langs = new Map<string, LangJSON>()

export class Language<T extends readonly string[]> {
  constructor(
    private readonly allows: T,
    private readonly fallback: T[number],
    private readonly langDir = '/lang'
  ) {}

  private _getKey(langs: string[]): T[number] {
    // 完全一致
    const perfectMatched = langs.find((l) => !!l && this.allows.includes(l))
    if (perfectMatched) {
      return perfectMatched
    }

    // 前方一致
    const prefixMatched = this.allows.find((l) => langs.some((a) => !!a && (l.startsWith(a) || a.startsWith(l))))
    if (prefixMatched) {
      return prefixMatched
    }

    return this.fallback
  }

  getKeyFromServer(request: Request) {
    const url = new URL(request.url)
    const cookie = request.headers.get('cookie')
    const cookieLang = cookie?.split(';').find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
    return this._getKey(Array.from(new Set([
      url.pathname.split('/')[1],
      cookieLang?.split('=')[1],
      ...request.headers.get('Accept-Language').split(','),
    ])))
  }

  getKeyFromClient() {
    const cookie = document.cookie
    const cookieLang = cookie.split(';').find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
    return this._getKey(Array.from(new Set([
      location.pathname.split('/')[1],
      cookieLang?.split('=')[1],
    ])))
  }

  putKeyFromServer(lang: T[number], response: Response) {
    response.headers.set('Set-Cookie', `${COOKIE_NAME}=${lang}; Path=/`)
  }

  putKeyFromClient(lang: T[number]) {
    document.cookie = `${COOKIE_NAME}=${lang}; Path=/`
  }

  hasTranslation(lang: T[number]) {
    return langs.has(lang)
  }

  getTranslation(lang: T[number]) {
    return langs.get(lang)
  }

  async fetchTranslation(lang: T[number]) {
    if (this.hasTranslation(lang)) {
      return langs.get(lang)
    }
    const response = await fetch(`${this.langDir}/${lang}.json`)
    const json = await response.json() as LangJSON
    langs.set(lang, json)
    return json
  }
}
