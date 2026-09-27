/**
 * App-wide environment values.
 *
 * `process.env.EXPO_PUBLIC_*` must be referenced with static dot notation so
 * Expo CLI can inline it at build time — do not read it dynamically elsewhere.
 */
export const APP_ID = process.env.EXPO_PUBLIC_OPENWEATHERMAP_APP_ID;

export function requireAppId(): string {
  if (!APP_ID) {
    throw new Error(
      "EXPO_PUBLIC_OPENWEATHERMAP_APP_ID is not set — copy .env.example to .env",
    );
  }
  return APP_ID;
}
