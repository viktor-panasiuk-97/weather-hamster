// Specs: @specs/components/search-cities.md

import { geoCordinatesByCityName, type GeoLocation } from "@/api/weather-api";
import { SearchInput } from "@/components/ui/search-input";
import { addCities } from "@/store/cities";
import { debounce } from "@/utils/debounce";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type SearchCitiesProps = {
  style?: StyleProp<ViewStyle>;
};

function CloseButton({
  onPress,
  visible,
}: {
  onPress: () => void;
  visible: boolean;
}) {
  return (
    <Pressable
      onPress={visible ? onPress : undefined}
      style={[styles.closeButton, !visible && styles.closeButtonHidden]}
      hitSlop={8}
    >
      <Text style={styles.closeButtonText}>✕</Text>
    </Pressable>
  );
}

function Option({
  location,
  onPress,
}: {
  location: GeoLocation;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.option}>
      <Text style={styles.optionText}>
        {location.name}, {location.country}
      </Text>
    </Pressable>
  );
}

function NotFound() {
  return <Text style={styles.notFound}>Not Found</Text>;
}

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
      <View style={isOpen ? styles.fullScreenOverlay : undefined}>
        <View style={isOpen ? styles.fixedInputWrapper : styles.inputWrapper}>
          <View style={styles.searchInputFlex}>
            <SearchInput
              value={query}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              placeholder="Search for a city"
            />
          </View>
          <CloseButton onPress={handleClose} visible={isOpen} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: "fixed" as ViewStyle["position"],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#121212",
    zIndex: 10,
  },
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
  closeButton: {
    marginLeft: 12,
    padding: 8,
  },
  closeButtonHidden: {
    visibility: "hidden" as ViewStyle["visibility"],
  },
  closeButtonText: {
    fontSize: 18,
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
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
  },
  notFound: {
    fontSize: 16,
    color: "#aaa",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
  },
});
