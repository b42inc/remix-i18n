type LangJSON = Record<string, any>;
export type TranslationProps<T extends readonly string[]> = {
    allows: T;
    fallback: T[number];
    langDir?: string;
    useCookie?: boolean;
};
export declare class Translation<T extends readonly string[]> {
    private isBrowser;
    private readonly allows;
    private readonly fallback;
    private readonly langDir;
    private readonly useCookie;
    constructor(props: TranslationProps<T>);
    getFirstMatchLang(candidates: string[]): T[number];
    private _getLangInCookie;
    getFirstLangFromServer(request: Request): T[number];
    getFirstLangFromClient(): T[number];
    putLangFromServer(lang: T[number], response: Response): void;
    putLangFromClient(lang: T[number]): void;
    getTranslation(lang: T[number]): LangJSON;
    hasTranslation(lang: T[number]): boolean;
    fetch(lang: T[number]): Promise<LangJSON>;
    toEmbbededString(): string;
}
export {};
