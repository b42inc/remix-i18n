"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useI18nTranslate = void 0;
const useI18n_1 = require("./useI18n");
const react_1 = require("react");
const useI18nTranslate = () => {
    const { langFile } = (0, useI18n_1.useI18n)();
    const translate = (0, react_1.useCallback)((key, args) => {
        const template = langFile[key] || '';
        if (!args) {
            return template;
        }
        return Object.entries(args).reduce((str, [arg, value]) => str.replace(new RegExp(`{${arg}}`, 'g'), value), template);
    }, [langFile]);
    return translate;
};
exports.useI18nTranslate = useI18nTranslate;
