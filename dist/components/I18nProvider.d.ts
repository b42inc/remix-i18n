import { PropsWithChildren, ReactNode } from 'react';
import { Language } from '../lib/Language';
type Props<T extends readonly string[]> = {
    locales: T;
    defaultLocale: T[number];
    lang: Language<T>;
};
export declare function I18nProvider<T extends readonly string[]>({ children, locales, lang, defaultLocale }: PropsWithChildren<Props<T>>): ReactNode;
export {};
