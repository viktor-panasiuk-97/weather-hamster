import { create } from "zustand";

type ErrorBarOptions = {
  message?: string;
  // When provided, the bar shows a "Retry" button instead of "Reload App".
  onRetry?: () => void;
};

type ErrorBarState = ErrorBarOptions & {
  visible: boolean;
  showErrorBar: (options?: ErrorBarOptions) => void;
  hideErrorBar: () => void;
};

export const useErrorBarStore = create<ErrorBarState>()((set) => ({
  visible: false,
  message: undefined,
  onRetry: undefined,
  showErrorBar: (options) =>
    set({ visible: true, message: options?.message, onRetry: options?.onRetry }),
  hideErrorBar: () => set({ visible: false, message: undefined, onRetry: undefined }),
}));
