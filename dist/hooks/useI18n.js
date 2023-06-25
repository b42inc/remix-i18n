"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useI18n = void 0;
const react_1 = require("react");
const I18n_1 = require("../context/I18n");
const useI18n = () => (0, react_1.useContext)(I18n_1.I18nContext);
exports.useI18n = useI18n;
