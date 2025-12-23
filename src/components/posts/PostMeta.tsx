import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Post } from '@/types';
import { Info } from 'lucide-react';

type Props = {
  post: Post;
  wasUpdated: boolean;
  displayDate?: string | null;
};

export function PostMeta({ post, wasUpdated, displayDate }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b pb-4 text-sm text-muted-foreground sm:gap-4 sm:pb-6">
      <span>{post.author ?? 'Autor desconhecido'}</span>
      <span>•</span>

      {wasUpdated ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="group inline-flex cursor-help items-center gap-1.5">
              <time dateTime={displayDate ?? undefined}>
                atualizado em{' '}
                {displayDate
                  ? new Date(displayDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : ''}
              </time>
              <Info className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              Publicado em{' '}
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''}
            </p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <time dateTime={displayDate ?? undefined}>
          {displayDate
            ? new Date(displayDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : ''}
        </time>
      )}
    </div>
  );
}
