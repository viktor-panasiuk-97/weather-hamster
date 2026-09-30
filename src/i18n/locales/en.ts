export const en = {
  common: {
    searchFieldPlaceholder: "Search for a city",
  },
} as const;

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type TranslationResources = DeepStringRecord<typeof en>;
