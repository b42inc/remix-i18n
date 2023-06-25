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
exports.Language = void 0;
const COOKIE_NAME = 'i18n-locale';
const langs = new Map();
class Language {
    constructor(allows, fallback, langDir = '/lang') {
        this.allows = allows;
        this.fallback = fallback;
        this.langDir = langDir;
    }
    _getKey(langs) {
        // 完全一致
        const perfectMatched = langs.find((l) => !!l && this.allows.includes(l));
        if (perfectMatched) {
            return perfectMatched;
        }
        // 前方一致
        const prefixMatched = this.allows.find((l) => langs.some((a) => !!a && (l.startsWith(a) || a.startsWith(l))));
        if (prefixMatched) {
            return prefixMatched;
        }
        return this.fallback;
    }
    getKeyFromServer(request) {
        const url = new URL(request.url);
        const cookie = request.headers.get('cookie');
        const cookieLang = cookie === null || cookie === void 0 ? void 0 : cookie.split(';').find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
        return this._getKey(Array.from(new Set([
            url.pathname.split('/')[1],
            cookieLang === null || cookieLang === void 0 ? void 0 : cookieLang.split('=')[1],
            ...request.headers.get('Accept-Language').split(','),
        ])));
    }
    getKeyFromClient() {
        const cookie = document.cookie;
        const cookieLang = cookie.split(';').find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
        return this._getKey(Array.from(new Set([
            location.pathname.split('/')[1],
            cookieLang === null || cookieLang === void 0 ? void 0 : cookieLang.split('=')[1],
        ])));
    }
    putKeyFromServer(lang, response) {
        response.headers.set('Set-Cookie', `${COOKIE_NAME}=${lang}; Path=/`);
    }
    putKeyFromClient(lang) {
        document.cookie = `${COOKIE_NAME}=${lang}; Path=/`;
    }
    hasTranslation(lang) {
        return langs.has(lang);
    }
    getTranslation(lang) {
        return langs.get(lang);
    }
    fetchTranslation(lang) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasTranslation(lang)) {
                return langs.get(lang);
            }
            const response = yield fetch(`${this.langDir}/${lang}.json`);
            const json = yield response.json();
            langs.set(lang, json);
            return json;
        });
    }
}
exports.Language = Language;
