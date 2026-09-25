import { Image, View } from "react-native";

import type { WeatherHamsterVariant } from "@/components/weather-hamster";

const SHEET_COLUMNS = 5;
const SHEET_ROWS = 2;
const CELL_WIDTH = 281.6;
const CELL_HEIGHT = 384;
const CELL_ASPECT_RATIO = CELL_HEIGHT / CELL_WIDTH;

const ICON_SHEET_ORDER: readonly WeatherHamsterVariant[] = ["clear sky", "few clouds", "scattered clouds", "broken clouds", "shower rain", "thunderstorm", "rain", "snow", "mist", "sleep"];

export function WeatherHamsterIcon({ variant, size = 64 }: { variant: WeatherHamsterVariant; size?: number }) {
  const index = ICON_SHEET_ORDER.indexOf(variant);
  const row = Math.floor(index / SHEET_COLUMNS);
  const column = index % SHEET_COLUMNS;
  const cellHeight = size * CELL_ASPECT_RATIO;

  return (
    <View style={{ width: size, height: cellHeight, overflow: "hidden" }}>
      <Image
        source={require("@/assets/images/hamster-icons.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: size * SHEET_COLUMNS,
          height: cellHeight * SHEET_ROWS,
          left: -column * size,
          top: -row * cellHeight,
        }}
      />
    </View>
  );
}
