/// <reference types="react" />
import { Translation } from '../lib/Translation';
export type I18nContextProps<T extends readonly string[]> = {
    currentLocale: T[number];
    defaultLocale: T[number];
    setCurrentLocale: (locale: T[number]) => void;
    locales: T;
    langFile: Record<string, string>;
    translation: Translation<T>;
};
export declare const I18nContext: import("react").Context<I18nContextProps<string[]>>;
