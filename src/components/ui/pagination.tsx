import { Button } from '@/components/ui/button';

type PaginationProps = {
  page: number;
  hasNext: boolean;
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
  labelPrefix?: string;
};

export function Pagination({
  page,
  hasNext,
  loading = false,
  onPrev,
  onNext,
  labelPrefix = 'Página',
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        {labelPrefix} {page}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page === 1 || loading}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext || loading}>
          Próxima
        </Button>
      </div>
    </div>
  );
}
