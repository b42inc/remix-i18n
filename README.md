# @b42inc/remix-i18n

A lightweight internationalization library designed specifically for [Remix](https://remix.run) and Cloudflare.

## Features
- Strongly typed with TypeScript for safe usage.
- Works in a Service Worker environment, asynchronously fetching only necessary language files without embedding them.

## Installation

You can install it via yarn or npm.

```sh
$ yarn add @b42inc/remix-i18n
# or
$ npm i @b42inc/remix-i18n
```

## Usage
Create language files in `app/lang/{language_code}.yml`

### Example of `app/lang/ja.yml`:

```yaml
"@key": "ja"
"@label": "日本語"
title: "日本語のページです"
greeting:
  text: "こんにちは、{name}さん！"
  args:
    name: string
```

### Run generate JSON
This process should be repeated each time the language files are updated.
```sh
# `public/lang/{language_code}.json` & `node_modules/.remix-lang/@types`
$ yarn remix-i18n [--default en --srcDir app/lang --destDir public/lang]
```

### Setting in `app/entry.server.ts`:

```typescript
const locales = ['en', 'ja'] as const
const lang = new Language(locales, 'en')
const defaultLocale = lang.getKeyFromServer(request)
await lang.fetch(defaultLocale)
return (
  <I18nProvider lang={lang} locales={locales} defaultLocale={defaultLocale}>
    <RemixServer context={remixContext} url={request.url} />
  </I18nProvider>
)
```

### Setting in `app/entry.client.ts`:

```typescript
const hydrate = async () => {
  const locales = ['en', 'ja'] as const
  const lang = new Language(locales, 'en')
  const defaultLocale = lang.getKeyFromClient()
  await lang.fetch(defaultLocale)
  startTransition(() => {
    hydrateRoot(
      document,
      <I18nProvider lang={lang} locales={locales} defaultLocale={defaultLocale}>
        <RemixBrowser />
      </I18nProvider>
    )
  })
}
```

### Example of usage:

```typescript
const { currentLocale, setCurrentLocale, locales } = useI18n()
const t = useI18nTranslate()
t('greeting', { name: 'Akari'})

```

## Customization
Currently, there is no customization or extensibility.

## TODO
- Redirect to first language on first access

## License and Contribution
This is fully open-source. Contributors are welcome!
