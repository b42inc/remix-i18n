"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const I18n_1 = require("../context/I18n");
const I18nProvider = ({ children, locales, lang, defaultLocale }) => {
    const [currentLocale, setCurrentLocale] = (0, react_1.useState)(defaultLocale);
    const [langFile, setLangfile] = (0, react_1.useState)(lang.getTranslation(defaultLocale));
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        lang.putKeyFromClient(currentLocale);
        if (lang.hasTranslation(currentLocale)) {
            setLangfile(lang.getTranslation(currentLocale));
        }
        else {
            lang.fetchTranslation(currentLocale).then((file) => {
                if (!isMounted) {
                    return;
                }
                setLangfile(file);
            });
        }
        return () => {
            isMounted = false;
        };
    }, [currentLocale]);
    return ((0, jsx_runtime_1.jsx)(I18n_1.I18nContext.Provider, { value: {
            currentLocale,
            setCurrentLocale,
            locales,
            langFile,
        }, children: children }));
};
exports.I18nProvider = I18nProvider;
