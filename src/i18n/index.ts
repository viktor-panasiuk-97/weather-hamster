import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { getDeviceLanguage } from "./get-device-language";
import { DEFAULT_LANGUAGE, resources, SUPPORTED_LANGUAGES } from "./resources";

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
export { getDeviceLanguage } from "./get-device-language";
export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from "./resources";
