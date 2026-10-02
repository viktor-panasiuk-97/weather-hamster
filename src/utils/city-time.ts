// OpenWeatherMap gives a city's UTC offset in seconds. Shifting the timestamp by it and then
// reading the result as UTC yields the city's local wall-clock time, regardless of device timezone.
export function toCityDate(unixSeconds: number, tzOffsetSeconds: number) {
  return new Date((unixSeconds + tzOffsetSeconds) * 1000);
}

export function formatCityTime(unixSeconds: number, tzOffsetSeconds: number, locale: string) {
  return toCityDate(unixSeconds, tzOffsetSeconds).toLocaleTimeString(locale, {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });
}
