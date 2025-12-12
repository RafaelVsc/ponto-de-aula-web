import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Post } from '@/types';

type Props = {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  variant?: 'icon' | 'text';
  className?: string;
};

export function PostActions({ post, onEdit, onDelete, variant = 'icon', className }: Props) {
  if (variant === 'icon') {
    return (
      <div className={`flex gap-2 ${className ?? ''}`}>
        <Button size="icon-sm" variant="outline" onClick={() => onEdit?.(post)} disabled={!onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="destructive"
          onClick={() => onDelete?.(post)}
          disabled={!onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }
  return (
    <div className={`flex gap-2 ${className ?? ''}`}>
      <Button size="sm" variant="outline" onClick={() => onEdit?.(post)} disabled={!onEdit}>
        <Edit className="w-4 h-4 mr-1" />
        Editar
      </Button>
      <Button size="sm" variant="destructive" onClick={() => onDelete?.(post)} disabled={!onDelete}>
        <Trash2 className="w-4 h-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
}
