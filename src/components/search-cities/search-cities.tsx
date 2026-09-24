// Specs: @specs/components/search-cities.md

import { geoCordinatesByCityName, type GeoLocation } from "@/api/weather-api";
import { CloseButton } from "@/components/search-cities/close-button";
import { NotFound } from "@/components/search-cities/not-found";
import { Option } from "@/components/search-cities/option";
import { Overlay } from "@/components/search-cities/overlay";
import { SearchInput } from "@/components/ui/search-input";
import { addCities } from "@/store/cities";
import { debounce } from "@/utils/debounce";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type SearchCitiesProps = {
  style?: StyleProp<ViewStyle>;
};

export function SearchCities({ style }: SearchCitiesProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<GeoLocation[]>([]);
  const latestQueryRef = useRef("");
  const runSearchRef = useRef<((searchQuery: string) => void) | null>(null);

  useEffect(() => {
    runSearchRef.current = debounce((searchQuery: string) => {
      geoCordinatesByCityName(searchQuery)
        .then((locations) => {
          if (latestQueryRef.current !== searchQuery) return;
          setResults(locations);
        })
        .catch(() => {
          if (latestQueryRef.current !== searchQuery) return;
          setResults([]);
        });
    }, 250);
  }, []);

  function handleChangeText(text: string) {
    setQuery(text);
    latestQueryRef.current = text;

    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    runSearchRef.current?.(text);
  }

  function handleFocus() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    latestQueryRef.current = "";
  }

  function handleSelect(location: GeoLocation) {
    addCities([location]);
    handleClose();
  }

  return (
    <View style={style}>
      {isOpen && <Overlay />}
      <View style={isOpen ? styles.fixedInputWrapper : styles.inputWrapper}>
        <View style={styles.searchInputFlex}>
          <SearchInput
            value={query}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            placeholder="Search for a city"
          />
        </View>
        {isOpen && <CloseButton onPress={handleClose} />}
      </View>
      {isOpen && query.trim().length > 0 && (
        <View style={styles.resultsContainer}>
          {results.length === 0 ? (
            <NotFound />
          ) : (
            <ScrollView style={styles.resultsList} keyboardShouldPersistTaps="handled">
              {results.map((location, index) => (
                <Option
                  key={`${location.name}-${location.country}-${index}`}
                  location={location}
                  onPress={() => handleSelect(location)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  fixedInputWrapper: {
    position: "fixed" as ViewStyle["position"],
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputFlex: {
    flex: 1,
  },
  resultsContainer: {
    position: "fixed" as ViewStyle["position"],
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  resultsList: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
