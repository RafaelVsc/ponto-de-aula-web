import defaultPostImage from '@/assets/login-bg.png';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCan } from '@/hooks/useCan';
import type { Post } from '@/types';
import { SquarePlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostActions } from './PostActions';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export function PostCard({ post, showActions = false, onEdit, onDelete }: PostCardProps) {
  const can = useCan();
  const canUpdate = can?.('update', 'Post', post) ?? false;
  const canDelete = can?.('delete', 'Post', post) ?? false;
  const hasActions = showActions && (canUpdate || canDelete);
  const MAX_TAGS = 4;
  const visibleTags = post.tags?.slice(0, MAX_TAGS) ?? [];
  const extraTags = (post.tags?.length ?? 0) - visibleTags.length;

  return (
    <Card className="p-4 h-full">
      {/* Imagem */}
      <div className="w-full h-40 sm:h-48 lg:h-36 bg-gray-100 rounded-md overflow-hidden">
        <img
          src={post.imageUrl || defaultPostImage}
          alt={post.title ?? 'Imagem do post'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={e => {
            // Se a URL customizada falhar, usa a imagem padrão
            e.currentTarget.src = defaultPostImage;
          }}
        />
      </div>

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
              <span>Por: {post.author ?? 'Autor desconhecido'}</span>
              <br />
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
            </div>

            {/* Ícone de vídeo */}
            <div>
              {post.videoUrl ? (
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
          {/* Tags */}

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {extraTags > 0 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{extraTags}
                </span>
              )}
            </div>
          )}

          {/* Ações (se habilitadas) */}
          {hasActions && (
            <div className="flex gap-2 pt-2 border-t">
              <PostActions
                post={post}
                onEdit={canUpdate ? onEdit : undefined}
                onDelete={canDelete ? onDelete : undefined}
                variant="text"
                className="w-full justify-between sm:justify-start gap-2"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
