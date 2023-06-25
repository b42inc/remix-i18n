export type I18nContextProps<T extends readonly string[]> = {
    currentLocale: T[number];
    setCurrentLocale: (locale: T[number]) => void;
    locales: T;
    langFile: Record<string, string>;
};
export declare const I18nContext: import("react").Context<I18nContextProps<[]>>;
