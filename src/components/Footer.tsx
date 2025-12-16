import { HandHelping } from 'lucide-react';
import { useVlibras } from '@/hooks/useVlibras';

export function Footer() {
  const { enabled, loading, toggle } = useVlibras();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 backdrop-blur-sm shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Ponto de Aula · Acessibilidade em Libras</p>
        <button
          type="button"
          onClick={toggle}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <HandHelping
            className={`h-4 w-4 ${enabled ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <span className={enabled ? 'text-primary' : 'text-muted-foreground'}>
            {loading ? 'Ativando...' : enabled ? 'VLibras está ligado' : 'VLibras está desligado'}
          </span>
        </button>
      </div>
    </footer>
  );
}
