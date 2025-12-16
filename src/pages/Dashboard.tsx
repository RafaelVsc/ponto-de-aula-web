import { useCallback, useEffect, useMemo, useState } from 'react';
import { NewPostButton } from '@/components/posts/NewPostButton';
import { PostsGrid } from '@/components/posts/PostGrid';
import { PostTable } from '@/components/posts/PostTable';
import { PostSearch } from '@/components/posts/PostSearch';
import { ViewModeToggle } from '@/components/posts/ViewModeToggle';
import { getErrorMessage } from '@/lib/errors';
import { useViewMode } from '@/hooks/useViewMode';
import { useAuth } from '@/hooks/useAuth';
import { fetchPosts, searchPosts } from '@/services/post.service';
import type { Post, PostSearchParams } from '@/types';
import { Pagination } from '@/components/ui/pagination';

const PAGE_SIZE = 9;
const VIEW_MODE_KEY = 'pda:viewMode:dashboard';

export default function Dashboard() {
  const { viewMode, changeView } = useViewMode(VIEW_MODE_KEY, 'grid');
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filterOptionsPosts, setFilterOptionsPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState<PostSearchParams>({});
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.search ||
          filters.tag ||
          filters.authorId ||
          filters.authorName ||
          filters.sortBy ||
          filters.sortOrder,
      ),
    [filters],
  );

  const fetchPage = useCallback(
    async (targetPage: number, nextFilters: PostSearchParams) => {
      setLoading(true);
      setError(null);
      try {
        // Look-ahead: busca um item extra para saber se existe próxima página
        const resp = await searchPosts({ ...nextFilters, page: targetPage, limit: PAGE_SIZE + 1 });
        const items = resp.data ?? [];
        setHasNextPage(items.length > PAGE_SIZE);
        setPosts(items.slice(0, PAGE_SIZE));
        setPage(targetPage);
      } catch (err) {
        setError(getErrorMessage(err, 'Erro ao buscar posts'));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    // Carrega opções para filtros (tags/autores) e primeira página paginada
    (async () => {
      try {
        const resp = await fetchPosts();
        if (!mounted) return;
        setFilterOptionsPosts(resp.data ?? []);
      } catch (err) {
        setError(getErrorMessage(err, 'Erro ao carregar filtros'));
      }
    })();

    fetchPage(1, {});

    return () => {
      mounted = false;
    };
  }, [fetchPage]);

  const handleSearch = useCallback(
    async (params: PostSearchParams) => {
      // Paginação controlada aqui; descartamos page/limit vindos do formulário
      const { page: _ignoredPage, limit: _ignoredLimit, ...sanitizedFilters } = params;
      void _ignoredPage;
      void _ignoredLimit;
      setFilters(sanitizedFilters);
      await fetchPage(1, sanitizedFilters);
    },
    [fetchPage],
  );

  const handlePrevPage = async () => {
    if (page === 1) return;
    await fetchPage(page - 1, filters);
  };

  const handleNextPage = async () => {
    if (!hasNextPage) return;
    await fetchPage(page + 1, filters);
  };

  const emptyMessage = hasActiveFilters
    ? 'Nenhum post encontrado com os filtros aplicados.'
    : 'Nenhum conteúdo disponível no momento.';

  const canCreatePost =
    user?.role === 'ADMIN' || user?.role === 'SECRETARY' || user?.role === 'TEACHER';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Explore o conteúdo disponível</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
            <ViewModeToggle value={viewMode} onChange={changeView} className="w-full sm:w-auto" />
            {canCreatePost && (
              <NewPostButton size="sm" className="w-full min-w-[140px] sm:w-auto" />
            )}
          </div>
        </div>

        <PostSearch posts={filterOptionsPosts} onSearch={handleSearch} loading={loading} />

        {viewMode === 'grid' ? (
          <PostsGrid posts={posts} loading={loading} error={error} emptyMessage={emptyMessage} />
        ) : (
          <PostTable posts={posts} loading={loading} error={error} emptyMessage={emptyMessage} />
        )}

        <Pagination
          page={page}
          hasNext={hasNextPage}
          loading={loading}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  );
}
