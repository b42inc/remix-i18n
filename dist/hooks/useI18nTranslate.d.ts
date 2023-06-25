export type RemixI18nTranslationKeys = keyof RemixI18nTranslations;
export type RemixI18nTranslationArgs = RemixI18nTranslations[RemixI18nTranslationKeys];
export type RemixI18nTranslationTextKeys = {
    [K in RemixI18nTranslationKeys]: RemixI18nTranslations[K] extends Record<string, any> ? never : K;
}[RemixI18nTranslationKeys];
export type RemixI18nTranslationHasArgsKeys = Exclude<RemixI18nTranslationKeys, RemixI18nTranslationTextKeys>;
export declare const useI18nTranslate: () => {
    (key: RemixI18nTranslationTextKeys): string;
    (key: RemixI18nTranslationHasArgsKeys, args: RemixI18nTranslations[RemixI18nTranslationHasArgsKeys]): string;
};
