import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

type Props = {
  value: 'grid' | 'table';
  onChange: (mode: 'grid' | 'table') => void;
  className?: string;
};

export function ViewModeToggle({ value, onChange, className }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Button
        variant={value === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('grid')}
      >
        <LayoutGrid className="w-4 h-4 mr-1" />
        Cards
      </Button>
      <Button
        variant={value === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('table')}
      >
        <List className="w-4 h-4 mr-1" />
        Tabela
      </Button>
    </div>
  );
}
