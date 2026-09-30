import { getLocales } from "expo-localization";

import { DEFAULT_LANGUAGE, type Language, SUPPORTED_LANGUAGES } from "./resources";

const isSupportedLanguage = (code: string): code is Language =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

export const getDeviceLanguage = (): Language => {
  const code = getLocales()[0]?.languageCode;

  return code && isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
};
