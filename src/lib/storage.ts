import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageKeys = {
  locale: "@what-eat-today/locale",
  recipes: "@what-eat-today/recipes"
} as const;

export async function readString(key: string, fallback: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function writeString(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Best effort persistence for offline-first UX.
  }
}

export async function readJson<T>(key: string, fallback: T) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Best effort persistence for offline-first UX.
  }
}
