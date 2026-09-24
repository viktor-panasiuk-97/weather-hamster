import { Image, View } from "react-native";

const SHEET_COLUMNS = 5;
const SHEET_ROWS = 2;
const CELL_WIDTH = 281.5;
const CELL_HEIGHT = 384;
const CELL_ASPECT_RATIO = CELL_HEIGHT / CELL_WIDTH;

export const WEATHER_HAMSTER_VARIANTS = ["clear sky", "few clouds", "scattered clouds", "broken clouds", "shower rain", "rain", "thunderstorm", "snow", "mist", "sleep"] as const;

export type WeatherHamsterVariant = (typeof WEATHER_HAMSTER_VARIANTS)[number];

export function WeatherHamster({ variant, size = 250 }: { variant: WeatherHamsterVariant; size?: number }) {
  const index = WEATHER_HAMSTER_VARIANTS.indexOf(variant);
  const row = Math.floor(index / SHEET_COLUMNS);
  const column = index % SHEET_COLUMNS;
  const cellSize = size * CELL_ASPECT_RATIO;

  return (
    <View style={{ width: size, height: cellSize, overflow: "hidden" }}>
      <Image
        source={require("@/assets/images/hamster.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: size * SHEET_COLUMNS,
          height: cellSize * SHEET_ROWS,
          left: -column * size,
          top: -row * cellSize,
        }}
      />
    </View>
  );
}
