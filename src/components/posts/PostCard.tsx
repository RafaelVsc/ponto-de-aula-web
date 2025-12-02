import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Post } from '@/types';
import { SquarePlay, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/useCan';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export function PostCard({ post, showActions = false, onEdit, onDelete }: PostCardProps) {
  const can = useCan();

  return (
    <Card className="p-4 h-full">
      {/* Imagem */}
      {(post as any).imageUrl ? (
        <div className="w-full h-40 sm:h-48 lg:h-36 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={(post as any).imageUrl}
            alt={post.title ?? 'Imagem do post'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-40 sm:h-48 lg:h-36 bg-gray-50 flex items-center justify-center text-sm text-muted-foreground rounded-md">
          Sem imagem
        </div>
      )}

      <div className="flex flex-col h-full mt-3">
        {/* Título */}
        <Link to={`/posts/${post.id}`}>
          <h2 className="text-lg font-semibold hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Conteúdo */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">{post.content}</p>

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-start text-xs text-muted-foreground">
            <div className="space-y-1">
              <span>Por: {(post as any).author ?? 'Autor desconhecido'}</span>
              <br />
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
            </div>

            {/* Ícone de vídeo */}
            <div>
              {(post as any).videoUrl ? (
                <Tooltip>
                  <TooltipTrigger>
                    <SquarePlay className="w-5 h-5" color="#dc2626" strokeWidth={2} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conteúdo adicional em vídeo</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <SquarePlay className="w-5 h-5" color="#9ca3af" strokeWidth={2} />
              )}
            </div>
          </div>

          {/* Ações (se habilitadas) */}
          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              {can('update', 'Post', post) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(post)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
              {can('delete', 'Post', post) && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(post)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
