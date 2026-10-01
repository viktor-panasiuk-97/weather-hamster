import type { CurrentWeatherData } from "@/api/weather-api";
import { TableRow } from "@/components/weather-table/table-row";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function formatTime(unixSeconds: number, locale: string) {
  return new Date(unixSeconds * 1000).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WeatherTable({
  data,
  latestUpdateTimeStamp,
}: {
  data: CurrentWeatherData;
  latestUpdateTimeStamp: number;
}) {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.table}>
      <TableRow label={t("cityWeather.humidity")} value={`${data.main.humidity}%`} />
      <TableRow
        label={t("cityWeather.pressure")}
        value={t("cityWeather.units.pressure", { value: data.main.pressure })}
      />
      <TableRow
        label={t("cityWeather.wind")}
        value={t("cityWeather.units.wind", { speed: data.wind.speed, deg: data.wind.deg })}
      />
      <TableRow label={t("cityWeather.clouds")} value={`${data.clouds.all}%`} />
      <TableRow
        label={t("cityWeather.visibility")}
        value={t("cityWeather.units.visibility", { value: data.visibility })}
      />
      <TableRow label={t("cityWeather.sunrise")} value={formatTime(data.sys.sunrise, i18n.language)} />
      <TableRow label={t("cityWeather.sunset")} value={formatTime(data.sys.sunset, i18n.language)} />
      <TableRow
        label={t("cityWeather.updated")}
        value={new Date(latestUpdateTimeStamp).toLocaleTimeString(i18n.language)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1c1c1e",
  },
});
