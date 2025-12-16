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
import { Pagination } from '@/components/ui/pagination';
import { deletePostById, fetchMyPosts } from '@/services/post.service';
import type { Post } from '@/types';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const VIEW_MODE_KEY = 'pda:viewMode:mine';
const PAGE_SIZE = 9;

export default function MyPosts() {
  const { viewMode, changeView } = useViewMode(VIEW_MODE_KEY, 'grid');

  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const emptyMessage = useMemo(
    () => 'Você ainda não criou nenhum post. Que tal começar agora?',
    [],
  );

  const paginate = useCallback((list: Post[], targetPage: number) => {
    const start = (targetPage - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);
    setPosts(pageItems);
    setPage(targetPage);
    setHasNextPage(start + PAGE_SIZE < list.length);
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchMyPosts();
      const items = resp.data ?? [];
      setAllPosts(items);
      paginate(items, 1);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Erro ao carregar seus posts'));
    } finally {
      setLoading(false);
    }
  }, [paginate]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleEdit = (post: Post) => {
    navigate(`/posts/edit/${post.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePost) return;

    try {
      await deletePostById(deletePost.id);
      setAllPosts(prevAll => {
        const updated = prevAll.filter(p => p.id !== deletePost.id);
        const totalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
        const nextPage = Math.min(page, totalPages);
        paginate(updated, nextPage);
        return updated;
      });
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

  const handlePrevPage = async () => {
    if (page === 1) return;
    paginate(allPosts, page - 1);
  };

  const handleNextPage = async () => {
    if (!hasNextPage) return;
    paginate(allPosts, page + 1);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meus Posts</h1>
          <p className="text-muted-foreground">Gerencie seus conteúdos</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
          <ViewModeToggle value={viewMode} onChange={changeView} className="w-full sm:w-auto" />
          <NewPostButton size="sm" className="w-full min-w-[140px] sm:w-auto" />
        </div>
      </div>

      {list}

      <Pagination
        page={page}
        hasNext={hasNextPage}
        loading={loading}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

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
