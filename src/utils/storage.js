// Safe LocalStorage helpers. Never crash the app if storage is blocked or full.

export function loadItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn(`Could not read "${key}" from LocalStorage`, error);
    return fallback;
  }
}

export function saveItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not save "${key}" to LocalStorage`, error);
    return false;
  }
}