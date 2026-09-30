import { en } from "./locales/en";
import { uk } from "./locales/uk";

export const resources = {
  en2: { translation: en },
  // TODO: Temp for testing
  en: { translation: uk },
} as const;

export const SUPPORTED_LANGUAGES = ["en", "uk"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";
