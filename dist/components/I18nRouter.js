"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nRouter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useI18n_1 = require("../hooks/useI18n");
const react_2 = require("@remix-run/react");
const I18nRouter = ({ enableLanguageChange, enableLanguageRoute, enforceLanguageRoute, }) => {
    const { lang: langParam } = (0, react_2.useParams)();
    const currentLocation = (0, react_2.useLocation)();
    const navigate = (0, react_2.useNavigate)();
    // TODO: How to get origin.
    const origin = 'https://example.com';
    const { translation, currentLocale, setCurrentLocale, defaultLocale, locales } = (0, useI18n_1.useI18n)();
    (0, react_1.useEffect)(() => {
        function onLanguageChange() {
            const newLocale = translation.getFirstMatchLang([
                ...navigator.languages,
            ]);
            setCurrentLocale(newLocale);
        }
        if (enableLanguageChange) {
            window.addEventListener('languagechange', onLanguageChange);
        }
        return () => {
            window.removeEventListener('languagechange', onLanguageChange);
        };
    }, [enableLanguageChange, translation]);
    (0, react_1.useEffect)(() => {
        if (!enableLanguageRoute) {
            return;
        }
        const currentPathname = currentLocation.pathname;
        const langRegx = new RegExp(`^\/${langParam}(\/|$)`);
        let pathname;
        if (currentLocale === defaultLocale && !enforceLanguageRoute) {
            pathname = langParam
                ? currentPathname.replace(langRegx, '$1')
                : currentPathname;
        }
        else {
            pathname = langParam
                ? currentPathname.replace(langRegx, `/${currentLocale}$1`)
                : `/${currentLocale}${currentPathname}`;
        }
        if (pathname === currentPathname) {
            return;
        }
        navigate(Object.assign(Object.assign({}, currentLocation), { pathname }));
    }, [
        enableLanguageRoute,
        enforceLanguageRoute,
        currentLocation,
        langParam,
        currentLocale,
        defaultLocale,
        navigate,
    ]);
    if (!enableLanguageRoute) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: locales.map((locale) => ((0, jsx_runtime_1.jsx)("link", { rel: "alternate", href: locale === defaultLocale && !enforceLanguageRoute
                ? `${origin}`
                : `${origin}/${locale}/`, hrefLang: locale }))) }));
};
exports.I18nRouter = I18nRouter;
