import { PropsWithChildren, ReactNode } from 'react';
import { Translation } from '../lib/Translation';
type Props<T extends readonly string[]> = {
    locales: T;
    defaultLocale: T[number];
    translation: Translation<T>;
};
export declare function I18nProvider<T extends readonly string[]>({ children, locales, translation, defaultLocale, }: PropsWithChildren<Props<T>>): ReactNode;
export {};
