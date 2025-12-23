import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '@/lib/errors';
import { fetchPosts, searchPosts } from '@/services/post.service';
import type { Post, PostSearchParams } from '@/types';

const PAGE_SIZE = 9;

type PagedPostsState = {
  posts: Post[];
  filterOptions: Post[];
  filters: PostSearchParams;
  page: number;
  hasNextPage: boolean;
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  handleSearch: (params: PostSearchParams) => Promise<void>;
  handlePrevPage: () => Promise<void>;
  handleNextPage: () => Promise<void>;
};

export function usePagedPosts(): PagedPostsState {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterOptions, setFilterOptions] = useState<Post[]>([]);
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
        setFilterOptions(resp.data ?? []);
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

  const handlePrevPage = useCallback(async () => {
    if (page === 1) return;
    await fetchPage(page - 1, filters);
  }, [fetchPage, filters, page]);

  const handleNextPage = useCallback(async () => {
    if (!hasNextPage) return;
    await fetchPage(page + 1, filters);
  }, [fetchPage, filters, hasNextPage, page]);

  return {
    posts,
    filterOptions,
    filters,
    page,
    hasNextPage,
    loading,
    error,
    hasActiveFilters,
    handleSearch,
    handlePrevPage,
    handleNextPage,
  };
}
