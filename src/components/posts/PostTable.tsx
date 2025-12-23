import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Post } from '@/types';
import { SquarePlay } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { PostActions } from './PostActions';

type Props = {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
};

const MAX_TAGS = 3;

export function PostTable({
  posts,
  loading,
  error,
  emptyMessage = 'Nenhum post.',
  showActions = false,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-red-500">Erro: {error}</p>;
  if (!posts.length) return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-16 text-center">Vídeo</TableHead>
            {showActions && <TableHead className="w-48 text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => {
            const visibleTags = post.tags?.slice(0, MAX_TAGS) ?? [];
            const extraTags = (post.tags?.length ?? 0) - visibleTags.length;
            return (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Link to={`/posts/${post.id}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>{post.author || '—'}</TableCell>
                <TableCell>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : '—'}
                </TableCell>
                <TableCell className="max-w-[220px]">
                  <div className="flex flex-wrap gap-1">
                    {visibleTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {extraTags > 0 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        +{extraTags}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {post.videoUrl ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SquarePlay
                          className="w-5 h-5 inline-block"
                          color="#dc2626"
                          strokeWidth={2}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Conteúdo adicional em vídeo</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <SquarePlay className="w-5 h-5 inline-block" color="#9ca3af" strokeWidth={2} />
                  )}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <PostActions
                      post={post}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      variant="icon"
                      className="flex justify-end gap-2"
                    />
                    {/* <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit?.(post)}
                        disabled={!onEdit}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete?.(post)}
                        disabled={!onDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div> */}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
