import type { Post } from '@/types';
import { PostCard } from './PostCard';

interface PostsGridProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  emptyMessage?: string;
}

export function PostsGrid({
  posts,
  loading,
  error,
  showActions = false,
  onEdit,
  onDelete,
  emptyMessage = 'Nenhum post encontrado.',
}: PostsGridProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">Erro: {error}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
