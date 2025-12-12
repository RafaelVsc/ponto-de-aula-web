export function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return fallback;
}

// Tenta extrair mensagem detalhada da API (padrão Nest/Zod-like com message e details[0].message)
export function getApiMessage(err: unknown, fallback: string) {
  if (!err || typeof err !== 'object') return fallback;

  const maybeResponse = (err as { response?: { data?: unknown } }).response;
  const data = maybeResponse?.data ?? (err as { data?: unknown }).data;
  if (!data || typeof data !== 'object') return fallback;

  type Detail = { message?: unknown };
  type ApiErr = { message?: unknown; details?: Detail[] };
  const parsed = data as ApiErr & { error?: ApiErr };

  const tryGetMessage = (source?: ApiErr) => {
    if (!source) return undefined;
    // prioriza detalhes mais específicos antes da mensagem genérica
    const firstDetail = source.details?.find(d => typeof d.message === 'string');
    if (firstDetail?.message && typeof firstDetail.message === 'string') {
      return firstDetail.message;
    }
    if (typeof source.message === 'string') return source.message;
    return undefined;
  };

  return (
    tryGetMessage(parsed) ??
    tryGetMessage(parsed.error) ??
    fallback
  );
}
