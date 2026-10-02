import { getForecastByCoordinates, type ForecastData, type ForecastItem } from "@/api/weather-api";
import { formatCityTime, getLocalizedWeatherDescription, toCityDate } from "@/utils";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

type ForecastDay = {
  key: string;
  label: string;
  items: ForecastItem[];
};

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

// The API returns items in chronological order, so consecutive items with the same date form a day.
// Dates are shifted to the city's timezone and read as UTC, so days split at the city's midnight.
function groupByDay(list: ForecastItem[], tzOffsetSeconds: number, t: TFunction): ForecastDay[] {
  const days: ForecastDay[] = [];

  for (const item of list) {
    const date = toCityDate(item.dt, tzOffsetSeconds);
    const key = date.toISOString().slice(0, 10);
    const lastDay = days[days.length - 1];

    if (lastDay?.key === key) {
      lastDay.items.push(item);
    } else {
      days.push({
        key,
        label: t(`forecast.weekdays.${WEEKDAY_KEYS[date.getUTCDay()]}`),
        items: [item],
      });
    }
  }

  return days;
}

export function DaysForecast({ lat, lon }: { lat: number; lon: number }) {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let ignore = false;

    getForecastByCoordinates(lat, lon)
      .then((data) => {
        if (!ignore) {
          setForecast(data);
        }
      })
      .catch((e: unknown) => {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "");
        }
      });

    return () => {
      ignore = true;
    };
  }, [lat, lon]);

  if (error !== null) {
    return <Text style={styles.message}>{error || t("forecast.loadError")}</Text>;
  }

  if (!forecast) {
    return <Text style={styles.message}>{t("forecast.loading")}</Text>;
  }

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.timeCell, styles.headerText]}>{t("forecast.time")}</Text>
        <Text style={[styles.cell, styles.headerText]}>{t("forecast.temp")}</Text>
        <Text style={[styles.cell, styles.weatherCell, styles.headerText]}>
          {t("forecast.weather")}
        </Text>
        <Text style={[styles.cell, styles.headerText]}>{t("forecast.rain")}</Text>
      </View>
      {groupByDay(forecast.list, forecast.city.timezone, t).map((day) => (
        <View key={day.key}>
          <View style={[styles.row, styles.dayRow]}>
            <Text style={styles.dayText}>{day.label}</Text>
          </View>
          {day.items.map((item) => (
            <View key={item.dt} style={styles.row}>
              <Text style={[styles.cell, styles.timeCell]}>
                {formatCityTime(item.dt, forecast.city.timezone, i18n.language)}
</Text>
              <Text style={styles.cell}>{Math.round(item.main.temp)}°C</Text>
              <Text style={[styles.cell, styles.weatherCell]} numberOfLines={1}>
                {getLocalizedWeatherDescription(item.weather[0], t)}
              </Text>
              <Text style={styles.cell}>{Math.round(item.pop * 100)}%</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    color: "#1c1c1e",
    textAlign: "center",
    marginTop: 16,
  },
  table: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1c1c1e",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2c",
  },
  headerRow: {
    backgroundColor: "#2a2a2c",
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: "#e5e5e7",
  },
  timeCell: {
    flex: 2,
  },
  weatherCell: {
    flex: 2,
  },
  dayRow: {
    backgroundColor: "#242426",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff9f0a",
  },
  headerText: {
    color: "#8e8e93",
    fontWeight: "600",
  },
});
