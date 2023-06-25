type LangJSON = Record<string, any>;
export declare class Language<T extends readonly string[]> {
    private readonly allows;
    private readonly fallback;
    private readonly langDir;
    constructor(allows: T, fallback: T[number], langDir?: string);
    private _getKey;
    getKeyFromServer(request: Request): T[number];
    getKeyFromClient(): T[number];
    putKeyFromServer(lang: T[number], response: Response): void;
    putKeyFromClient(lang: T[number]): void;
    hasTranslation(lang: T[number]): boolean;
    getTranslation(lang: T[number]): LangJSON;
    fetchTranslation(lang: T[number]): Promise<LangJSON>;
}
export {};
