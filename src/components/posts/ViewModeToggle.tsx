import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

type Props = {
  value: 'grid' | 'table';
  onChange: (mode: 'grid' | 'table') => void;
  className?: string;
};

export function ViewModeToggle({ value, onChange, className }: Props) {
  return (
    <div className={`flex flex-col items-stretch gap-2 sm:flex-row sm:items-center ${className ?? ''}`}>
      <Button
        variant={value === 'grid' ? 'default' : 'outline'}
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => onChange('grid')}
      >
        <LayoutGrid className="w-4 h-4 mr-1" />
        Cards
      </Button>
      <Button
        variant={value === 'table' ? 'default' : 'outline'}
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => onChange('table')}
      >
        <List className="w-4 h-4 mr-1" />
        Tabela
      </Button>
    </div>
  );
}
