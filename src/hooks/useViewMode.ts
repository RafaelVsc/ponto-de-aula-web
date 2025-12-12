import { useState } from 'react';

export function useViewMode(storageKey: string, defaultMode: 'grid' | 'table' = 'grid') {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved === 'table' ? 'table' : defaultMode;
  });
  const changeView = (mode: 'grid' | 'table') => {
    setViewMode(mode);
    localStorage.setItem(storageKey, mode);
  };
  return { viewMode, changeView };
}
