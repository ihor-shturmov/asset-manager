import { useCallback } from 'react';

export function useAsyncLocalStorage<T>() {
  const loadAsync = useCallback((key: string): Promise<T | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const raw = localStorage.getItem(key);
        if (!raw) return resolve(null);
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve(null);
        }
      }, 100);
    });
  }, []);

  const saveAsync = useCallback((key: string, value: T): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }, 100);
    });
  }, []);

  return { loadAsync, saveAsync };
}
