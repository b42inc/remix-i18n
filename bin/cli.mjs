#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile, lstat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { load } from 'js-yaml'
import minimist from 'minimist'


async function exists(filepath) {
  try {
    return !!(await lstat(filepath))
  } catch (e) {
    return false
  }
}

(async () => {
  console.time('remix-lang-compiler')
  // node bin/cli.js --default en --srcDir app/lang --destDir public/lang
  const args = minimist(process.argv.slice(2), {
    default: {
      default: 'en',
      srcDir: 'app/lang',
      destDir: 'public/lang'
    }
  });

  // Directories for the input and output files
  const LANG_DIR = join(process.cwd(), args.srcDir);
  const OUTPUT_DIR_JSON = join(process.cwd(), args.destDir);
  const OUTPUT_DIR_TS = join(process.cwd(), 'node_modules', '.remix-lang', '@types');
  const primaryLang = args.default;
  let tsDef = '';

  if (!primaryLang) {
    console.error("Please provide a language as an argument");
    process.exit(1);
  }

  const [dirs] = await Promise.all([
    // Process each language file for JSON creation
    (async () => {
      if (await exists(LANG_DIR)) {
        return await readdir(LANG_DIR)
      }
    })(),
    // Ensure output directories exist
    (async () => {
      if (!await exists(OUTPUT_DIR_JSON)) {
        await mkdir(OUTPUT_DIR_JSON, { recursive: true });
      }
    })(),
    (async () => {
      if (!await exists(OUTPUT_DIR_TS)) {
        await mkdir(OUTPUT_DIR_TS, { recursive: true });
      }
    })(),
  ])

  if (!dirs) {
    console.error(`Language directory ${LANG_DIR} does not exist`);
    process.exit(1);
  }

  await Promise.all(
    dirs.map(async (file) => {
      const ext = extname(file)

      if (!(['.yml', '.yaml'].includes(ext))) {
        return
      }

      const doc = load(await readFile(join(LANG_DIR, file), 'utf8'));
      const outputFileName = basename(file, ext);

      // Convert to JSON and save it
      const json = Object.entries(doc).reduce((json, [key, value]) => {
        if (typeof value === 'object' && typeof value.text === 'string') {
          json[key] = value.text;
        } else {
          json[key] = value;
        }
        return json;
      }, {})
      await writeFile(
        join(OUTPUT_DIR_JSON, `${outputFileName}.json`),
        JSON.stringify(json),
      );

      // Extend TypeScript definition if this is the primary language
      if (outputFileName !== primaryLang) {
        return
      }

      const keyRegx = /^[a-zA-Z][\w]+$/
      function escapeKey(key) {
        return keyRegx.test(key) ? key : `'${key}'`
      }

      for (const [key, value] of Object.entries(doc)) {
        if (typeof value === 'object' && value !== null) {
          tsDef += `  ${escapeKey(key)}: {\n`;
          for (const [subKey, subValue] of Object.entries(value)) {
            if (subKey === 'args') {
              const value2 = Object.entries(subValue).map(([argKey, argValue]) => `${argKey}: ${argValue}`).join('; ')
              tsDef += `    ${value2}\n`;
            }
          }
          tsDef += `  };\n`;
        } else {
          tsDef += `  ${escapeKey(key)}: string;\n`;
        }
      }
      const tsFile = join(OUTPUT_DIR_TS, 'index.d.ts');
      await writeFile(tsFile, `interface RemixI18nTranslations {\n${tsDef}}`);
    })
  );
  console.timeEnd('remix-lang-compiler')
})()