"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const I18n_1 = require("../context/I18n");
function I18nProvider({ children, locales, translation, defaultLocale, }) {
    const [currentLocale, setCurrentLocale] = (0, react_1.useState)(defaultLocale);
    const [langFile, setLangfile] = (0, react_1.useState)(translation.getTranslation(defaultLocale));
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        translation.putLangFromClient(currentLocale);
        if (translation.hasTranslation(currentLocale)) {
            setLangfile(translation.getTranslation(currentLocale));
        }
        else {
            translation.fetch(currentLocale).then((file) => {
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
            defaultLocale,
            locales,
            langFile,
            translation,
        }, children: children }));
}
exports.I18nProvider = I18nProvider;
