import { NewPostButton } from '@/components/posts/NewPostButton';
import { PostsGrid } from '@/components/posts/PostGrid';
import { PostTable } from '@/components/posts/PostTable';
import { ViewModeToggle } from '@/components/posts/ViewModeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/ToastProvider';
import { useViewMode } from '@/hooks/useViewMode';
import { getErrorMessage } from '@/lib/errors';
import { deletePostById, fetchMyPosts } from '@/services/post.service';
import type { Post } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VIEW_MODE_KEY = 'pda:viewMode:mine';

export default function MyPosts() {
  const { viewMode, changeView } = useViewMode(VIEW_MODE_KEY, 'grid');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const emptyMessage = useMemo(
    () => 'Você ainda não criou nenhum post. Que tal começar agora?',
    [],
  );

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchMyPosts();
      console.log('meus posts', resp.data);
      setPosts(resp.data ?? []);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Erro ao carregar seus posts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleEdit = (post: Post) => {
    navigate(`/posts/edit/${post.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePost) return;

    try {
      await deletePostById(deletePost.id);
      setPosts(prev => prev.filter(p => p.id !== deletePost.id));
      toast({
        title: 'Post excluído',
        description: 'O post foi removido com sucesso.',
      });
    } catch (error: unknown) {
      const description =
        error instanceof Error ? error.message : 'Não foi possível excluir o post.';

      toast({
        title: 'Erro ao excluir',
        description,
        variant: 'destructive',
      });
    } finally {
      setDeletePost(null);
    }
  };

  const list = (
    <>
      {viewMode === 'grid' ? (
        <PostsGrid
          posts={posts}
          loading={loading}
          error={error}
          showActions={true}
          onEdit={handleEdit}
          onDelete={setDeletePost}
          emptyMessage={emptyMessage}
        />
      ) : (
        <PostTable
          posts={posts}
          loading={loading}
          error={error}
          showActions
          onEdit={handleEdit}
          onDelete={setDeletePost}
          emptyMessage={emptyMessage}
        />
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Meus Posts</h1>
          <p className="text-muted-foreground">Gerencie seus conteúdos</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <ViewModeToggle value={viewMode} onChange={changeView} className="w-full sm:w-auto" />
          <NewPostButton size="sm" className="w-full min-w-[140px] sm:w-auto" />
        </div>
      </div>

      {list}

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deletePost?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
