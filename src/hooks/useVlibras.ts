import { useContext } from 'react';
import { VlibrasContext } from '@/context/VlibrasContext';

export function useVlibras() {
  const ctx = useContext(VlibrasContext);
  if (!ctx) throw new Error('useVlibras deve ser usado dentro de VlibrasProvider');
  return ctx;
}
