import { useEffect, useState } from "react";

/* use Local Storage */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {

      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  /* Keyboard Event Handler */
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota) — state still works in-memory
    }
  }, [key, value]);

  return [value, setValue];
}