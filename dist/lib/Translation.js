"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation = void 0;
const I18N_COOKIE_NAME = 'i18n-locale';
const I18N_BROWSER_EMBEDED_KEY = '__REMIX_I18N__';
const LANG_CACHE = {};
class Translation {
    constructor(allows, fallback, langDir = '/lang') {
        this.allows = allows;
        this.fallback = fallback;
        this.langDir = langDir;
        this.isBrowser = typeof window !== 'undefined';
        if (this.isBrowser && window[I18N_BROWSER_EMBEDED_KEY]) {
            const defaultKey = Object.keys(window[I18N_BROWSER_EMBEDED_KEY])[0];
            LANG_CACHE[defaultKey] = window[I18N_BROWSER_EMBEDED_KEY][defaultKey];
        }
    }
    getFirstMatchLang(candidates) {
        const uniqs = Array.from(new Set(candidates));
        for (let i = 0; i < uniqs.length; i++) {
            const lang = uniqs[i];
            if (lang) {
                const matched = this.allows.find((a) => a.startsWith(lang) || lang.startsWith(a));
                if (matched) {
                    return matched;
                }
            }
        }
        return this.fallback;
    }
    getFirstLangFromServer(request) {
        const url = new URL(request.url);
        const cookie = request.headers.get('cookie');
        const cookieLang = cookie === null || cookie === void 0 ? void 0 : cookie.split(';').find((c) => c.trim().startsWith(`${I18N_COOKIE_NAME}=`));
        return this.getFirstMatchLang([
            url.pathname.split('/')[1],
            cookieLang === null || cookieLang === void 0 ? void 0 : cookieLang.split('=')[1],
            ...request.headers.get('Accept-Language').split(','),
        ]);
    }
    getFirstLangFromClient() {
        const cookie = document.cookie;
        const cookieLang = cookie.split(';').find((c) => c.trim().startsWith(`${I18N_COOKIE_NAME}=`));
        return this.getFirstMatchLang([
            location.pathname.split('/')[1],
            cookieLang === null || cookieLang === void 0 ? void 0 : cookieLang.split('=')[1],
            ...navigator.languages,
        ]);
    }
    putLangFromServer(lang, response) {
        response.headers.set('Set-Cookie', `${I18N_COOKIE_NAME}=${lang}; Path=/`);
    }
    putLangFromClient(lang) {
        document.cookie = `${I18N_COOKIE_NAME}=${lang}; Path=/`;
    }
    hasTranslation(lang) {
        return !!LANG_CACHE[lang];
    }
    getTranslation(lang) {
        return LANG_CACHE[lang];
    }
    fetch(lang) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasTranslation(lang)) {
                return LANG_CACHE[lang];
            }
            const response = yield fetch(`${this.langDir}/${lang}.json`);
            const json = yield response.json();
            LANG_CACHE[lang] = json;
            return json;
        });
    }
    toEmbbededString() {
        return `;window.${I18N_BROWSER_EMBEDED_KEY} = ${JSON.stringify(LANG_CACHE)};`;
    }
}
exports.Translation = Translation;
