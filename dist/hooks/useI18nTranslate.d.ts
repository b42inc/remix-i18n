/// <reference types=".remix-lang" />
type Keys = keyof RemixI18nTranslations;
type NoRecordKeys = {
    [K in Keys]: RemixI18nTranslations[K] extends Record<string, any> ? never : K;
}[Keys];
export declare const useI18nTranslate: () => {
    (key: NoRecordKeys): string;
    <K extends "greeting">(key: K, args: RemixI18nTranslations[K]): string;
};
export {};
