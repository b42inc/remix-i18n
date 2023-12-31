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

### Update `remix.env.d.ts`
```typescript
/// <reference types=".remix-lang/@types" />
```

### Setting in `app/entry.server.ts`:

```typescript
const url = new URL(request.url)
const locales = ['en', 'ja'] as const
const translation = new Translation({
  allows: locales,
  fallback: 'en',
  langDir: `${url.origin}/lang`
})
const defaultLocale = translation.getFirstLangFromServer(request)
await translation.fetch(defaultLocale)
const markup = renderToString(
  <I18nProvider translation={translation} locales={locales} defaultLocale={defaultLocale}>
    <RemixServer context={remixContext} url={request.url} />
  </I18nProvider>
)
responseHeaders.set('Content-Type', 'text/html')

return new Response(
  '<!DOCTYPE html>' +
    markup.replace(
      '</head>',
      `<script>${translation.toEmbbededString()}</script></head>`
    ),
  {
    status: responseStatusCode,
    headers: responseHeaders,
  }
)
```

### Setting in `app/entry.client.ts`:

```typescript
const hydrate = async () => {
  const locales = ['en', 'ja'] as const
  const translation = new Translation({ allows: locales, fallback: 'en' })
  const defaultLocale = translation.getFirstLangFromClient()
  await translation.fetch(defaultLocale)
  startTransition(() => {
    hydrateRoot(
      document,
      <I18nProvider translation={translation} locales={locales} defaultLocale={defaultLocale}>
        <RemixBrowser />
      </I18nProvider>
    )
  })
}
```

### Setting in `app/root.tsx`:

```tsx
<head>
  {/* ↓ add */}
  <I18nRouter enableLanguageChange enableLanguageRoute enforceLanguageRoute />
</head>
```

### Example of usage:

```typescript
const { currentLocale, setCurrentLocale, locales } = useI18n()
const t = useI18nTranslate()
t('greeting', { name: 'Akari'})
```

## Route File Naming
If you set `enableLanguageRoute` to `true`, please name all your route files for i18n support either as `($lang)._index.tsx` or `$lang._index.tsx`.

When using `($lang)` as optional, no $lang will be used for the `defaultLocale`, but it will be included for other languages.

## TODO
- How to get origin in `I18nRouter.tsx`

## License and Contribution
This is fully open-source. Contributors are welcome!
