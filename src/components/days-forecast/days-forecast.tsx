import { getForecastByCoordinates, type ForecastData, type ForecastItem } from "@/api/weather-api";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type ForecastDay = {
  key: string;
  label: string;
  items: ForecastItem[];
};

function formatForecastTime(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// The API returns items in chronological order, so consecutive items with the same date form a day.
function groupByDay(list: ForecastItem[]): ForecastDay[] {
  const days: ForecastDay[] = [];

  for (const item of list) {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();
    const lastDay = days[days.length - 1];

    if (lastDay?.key === key) {
      lastDay.items.push(item);
    } else {
      days.push({
        key,
        label: date.toLocaleDateString([], { weekday: "short" }),
        items: [item],
      });
    }
  }

  return days;
}

export function DaysForecast({ lat, lon }: { lat: number; lon: number }) {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          setError(e instanceof Error ? e.message : "Failed to load forecast");
        }
      });

    return () => {
      ignore = true;
    };
  }, [lat, lon]);

  if (error) {
    return <Text style={styles.message}>{error}</Text>;
  }

  if (!forecast) {
    return <Text style={styles.message}>Loading forecast…</Text>;
  }

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.timeCell, styles.headerText]}>Time</Text>
        <Text style={[styles.cell, styles.headerText]}>Temp</Text>
        <Text style={[styles.cell, styles.weatherCell, styles.headerText]}>Weather</Text>
        <Text style={[styles.cell, styles.headerText]}>Rain</Text>
      </View>
      {groupByDay(forecast.list).map((day) => (
        <View key={day.key}>
          <View style={[styles.row, styles.dayRow]}>
            <Text style={styles.dayText}>{day.label}</Text>
          </View>
          {day.items.map((item) => (
            <View key={item.dt} style={styles.row}>
              <Text style={[styles.cell, styles.timeCell]}>{formatForecastTime(item.dt)}</Text>
              <Text style={styles.cell}>{Math.round(item.main.temp)}°C</Text>
              <Text style={[styles.cell, styles.weatherCell]} numberOfLines={1}>
                {item.weather[0]?.description ?? "—"}
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
    textTransform: "capitalize",
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
