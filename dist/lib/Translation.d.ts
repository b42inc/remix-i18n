type LangJSON = Record<string, any>;
export declare class Translation<T extends readonly string[]> {
    private readonly allows;
    private readonly fallback;
    private readonly langDir;
    private isBrowser;
    constructor(allows: T, fallback: T[number], langDir?: string);
    getFirstMatchLang(candidates: string[]): T[number];
    getFirstLangFromServer(request: Request): T[number];
    getFirstLangFromClient(): T[number];
    putLangFromServer(lang: T[number], response: Response): void;
    putLangFromClient(lang: T[number]): void;
    hasTranslation(lang: T[number]): boolean;
    getTranslation(lang: T[number]): LangJSON;
    fetch(lang: T[number]): Promise<LangJSON>;
    toEmbbededString(): string;
}
export {};
