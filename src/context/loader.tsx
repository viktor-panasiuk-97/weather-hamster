import { Loader, LOADER_MIN_DURATION_MS } from "@/components/loader";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";

type LoaderContextValue = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextValue | null>(null);

type LoaderProviderProps = {
  children: ReactNode;
};

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [visible, setVisible] = useState(false);
  const isVisible = useRef(false);
  const shownAt = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const hide = () => {
    isVisible.current = false;
    setVisible(false);
  };

  const showLoader = () => {
    clearHideTimeout();

    if (!isVisible.current) {
      isVisible.current = true;
      shownAt.current = Date.now();
      setVisible(true);
    }
  };

  const hideLoader = () => {
    if (!isVisible.current) {
      return;
    }

    clearHideTimeout();
    const remaining = LOADER_MIN_DURATION_MS - (Date.now() - shownAt.current);

    if (remaining <= 0) {
      hide();
    } else {
      hideTimeout.current = setTimeout(() => {
        hideTimeout.current = null;
        hide();
      }, remaining);
    }
  };

  useEffect(() => clearHideTimeout, []);

  return (
    <LoaderContext value={{ showLoader, hideLoader }}>
      {children}
      <Loader visible={visible} />
    </LoaderContext>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }

  return context;
}
