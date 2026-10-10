import { useState, useEffect } from "react";
import { loadItem, saveItem } from "../utils/storage";

const THEME_KEY = "jobtrack.theme";

export default function useTheme() {
  // Default is light. Only goes dark if user chose it before.
  const [theme, setTheme] = useState(() =>
    loadItem(THEME_KEY, "light") === "dark" ? "dark" : "light"
  );

  // Tell the page which theme is active (CSS reads this).
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveItem(THEME_KEY, next);
  }

  return { theme, toggleTheme };
}