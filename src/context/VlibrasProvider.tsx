import { useEffect, useMemo, useRef, useState } from 'react';
import { VlibrasContext } from './VlibrasContext';

const STORAGE_KEY = 'pda:vlibras';
const SCRIPT_ID = 'vlibras-script';
const CONTAINER_ID = 'vlibras-container';

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

function ensureContainer() {
  if (document.getElementById(CONTAINER_ID)) return;
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.innerHTML = `
    <div vw class="enabled">
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  `;
  document.body.appendChild(container);
}

function removeContainer() {
  const node = document.getElementById(CONTAINER_ID);
  if (node) node.remove();

  // O VLibras cria nós extras fora do container; removemos manualmente
  document.querySelectorAll('[vw], [vw-access-button], [vw-plugin-wrapper]').forEach(el => el.remove());
}

function removeScript() {
  const script = document.getElementById(SCRIPT_ID);
  if (script) script.remove();
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar VLibras'));
    document.body.appendChild(script);
  });
}

export function VlibrasProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });
  const [loading, setLoading] = useState(false);
  const widgetInitialized = useRef(false);

  useEffect(() => {
    let active = true;
    const enable = async () => {
      setLoading(true);
      try {
        ensureContainer();
        await loadScript();
        if (!active) return;
        if (window.VLibras?.Widget && !widgetInitialized.current) {
          // Inicializa apenas uma vez
          new window.VLibras.Widget('https://vlibras.gov.br/app');
          widgetInitialized.current = true;
        }
      } catch (err) {
        console.error(err);
        setEnabled(false);
        localStorage.setItem(STORAGE_KEY, 'false');
        removeContainer();
      } finally {
        if (active) setLoading(false);
      }
    };

    if (enabled) {
      enable();
    } else {
      removeContainer();
      removeScript();
      widgetInitialized.current = false;
    }

    return () => {
      active = false;
    };
  }, [enabled]);

  const toggle = () => {
    const next = !enabled;
    localStorage.setItem(STORAGE_KEY, String(next));
    if (!next) {
      removeContainer();
      removeScript();
    }
    // Recarrega para aplicar/retirar o widget de forma consistente
    window.location.reload();
  };

  const value = useMemo(() => ({ enabled, loading, toggle }), [enabled, loading]);

  return <VlibrasContext.Provider value={value}>{children}</VlibrasContext.Provider>;
}
