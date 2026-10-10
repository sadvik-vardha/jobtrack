import { useState, useEffect } from "react";
import { loadItem, saveItem } from "../utils/storage";

// Works like useState, but remembers the value in LocalStorage.
// isValid (optional) rejects bad stored values and falls back to initial.
export default function usePersistedState(key, initial, isValid) {
  const [value, setValue] = useState(() => {
    const stored = loadItem(key, initial);
    return isValid && !isValid(stored) ? initial : stored;
  });

  useEffect(() => {
    saveItem(key, value);
  }, [key, value]);

  return [value, setValue];
}