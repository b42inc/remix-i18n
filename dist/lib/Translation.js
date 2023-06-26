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
    constructor(props) {
        var _a, _b;
        this.isBrowser = typeof window !== 'undefined';
        this.allows = props.allows;
        this.fallback = props.fallback;
        this.langDir = (_a = props.langDir) !== null && _a !== void 0 ? _a : '/lang';
        this.useCookie = (_b = props.useCookie) !== null && _b !== void 0 ? _b : true;
        if (this.isBrowser &&
            I18N_BROWSER_EMBEDED_KEY in window &&
            typeof window[I18N_BROWSER_EMBEDED_KEY] === 'object' &&
            window[I18N_BROWSER_EMBEDED_KEY]) {
            Object.entries(window[I18N_BROWSER_EMBEDED_KEY]).forEach(([key, value]) => {
                LANG_CACHE[key] = value;
            });
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
    _getLangInCookie(cookie) {
        if (!this.useCookie || !cookie) {
            return '';
        }
        const cookieLang = cookie.split(';').find((c) => c.trim().startsWith(`${I18N_COOKIE_NAME}=`));
        return (cookieLang === null || cookieLang === void 0 ? void 0 : cookieLang.split('=')[1].trim()) || '';
    }
    getFirstLangFromServer(request) {
        var _a, _b;
        return this.getFirstMatchLang([
            (new URL(request.url)).pathname.split('/')[1],
            this._getLangInCookie(request.headers.get('cookie')),
            ...((_b = (_a = request.headers.get('Accept-Language')) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : []),
        ]);
    }
    getFirstLangFromClient() {
        return this.getFirstMatchLang([
            location.pathname.split('/')[1],
            this._getLangInCookie(document.cookie),
            ...navigator.languages,
        ]);
    }
    putLangFromServer(lang, response) {
        if (this.useCookie) {
            response.headers.set('Set-Cookie', `${I18N_COOKIE_NAME}=${lang}; Path=/`);
        }
    }
    putLangFromClient(lang) {
        if (this.useCookie) {
            document.cookie = `${I18N_COOKIE_NAME}=${lang}; Path=/`;
        }
    }
    getTranslation(lang) {
        return LANG_CACHE[lang];
    }
    hasTranslation(lang) {
        return !!this.getTranslation(lang);
    }
    fetch(lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = this.getTranslation(lang);
            if (exist) {
                return exist;
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
