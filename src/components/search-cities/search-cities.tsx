// Specs: @specs/components/search-cities.md

import { geoCordinatesByCityName, type GeoLocation } from "@/api/weather-api";
import { CloseButton } from "@/components/search-cities/close-button";
import { NotFound } from "@/components/search-cities/not-found";
import { Option } from "@/components/search-cities/option";
import { SearchInput } from "@/components/ui/search-input";
import { useCitiesStore } from "@/store/cities";
import { debounce } from "@/utils/debounce";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchCitiesProps = {
  style?: StyleProp<ViewStyle>;
};

export function SearchCities({ style }: SearchCitiesProps) {
  const addCity = useCitiesStore((state) => state.addCity);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<GeoLocation[]>([]);
  const modalInputRef = useRef<TextInput>(null);
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

  // On Android, an input focused while the Modal window is still appearing
  // (e.g. via autoFocus) gets a caret but the soft keyboard never opens, since
  // the window doesn't have input focus yet. So focus explicitly, after the
  // modal has settled.
  function handleModalShow() {
    setTimeout(() => {
      modalInputRef.current?.focus();
    }, 300);
  }

  function handleClose() {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    latestQueryRef.current = "";
  }

  function handleSelect(location: GeoLocation) {
    handleClose();
    addCity(location);
  }

  return (
    <View style={style}>
      {!isOpen && (
        // The inline input is only a trigger. If it took real focus and was
        // then unmounted, the keyboard would be dismissed right as the modal
        // input tries to open it.
        <Pressable onPress={handleFocus} accessibilityRole="search">
          <View pointerEvents="none">
            <SearchInput value={query} editable={false} />
          </View>
        </Pressable>
      )}
      {isOpen && (
        <Modal
          visible
          animationType="fade"
          onRequestClose={handleClose}
          onShow={handleModalShow}
          backdropColor="#121212"
        >
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalInputWrapper}>
              <View style={styles.searchInputFlex}>
                <SearchInput
                  value={query}
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  inputRef={modalInputRef}
                />
              </View>
              <CloseButton onPress={handleClose} />
            </View>
            {query.trim().length > 0 && (
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
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputFlex: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 8,
  },
  resultsList: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
