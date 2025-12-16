import { createContext } from 'react';

type VlibrasContextValue = {
  enabled: boolean;
  loading: boolean;
  toggle: () => void;
};

export const VlibrasContext = createContext<VlibrasContextValue | null>(null);
