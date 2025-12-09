import { NewPostButton } from '@/components/posts/NewPostButton';
import { PostsGrid } from '@/components/posts/PostGrid';
import { PostSearch } from '@/components/posts/PostSearch';
import { getErrorMessage } from '@/lib/errors';
import { fetchPosts, searchPosts } from '@/services/post.service';
import type { Post, PostSearchParams } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchPosts();
        console.log('fetchPosts response:', resp);
        if (!mounted) return;
        const postsData = resp.data ?? [];
        setPosts(postsData);
        setAllPosts(postsData);
        console.log('posts (state will be):', postsData.length);
      } catch (error: unknown) {
        setError(getErrorMessage(error, 'Erro ao carregar posts'));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Função de busca
  const handleSearch = useCallback(
    async (params: PostSearchParams) => {
      console.log('🎯 handleSearch params:', params);

      // Verifica se realmente não tem filtros aplicados
      const hasNoSearch = !params.search || params.search.trim() === '';
      const hasNoTag = !params.tag || params.tag.trim() === '';
      const hasNoAuthor = !params.authorId && !params.authorName;

      const hasNoSort = !params.sortBy && !params.sortOrder;

      const shouldReset = hasNoSearch && hasNoTag && hasNoSort && hasNoAuthor;

      if (shouldReset) {
        console.log('🔄 Resetting to allPosts:', allPosts.length, 'posts');
        setPosts(allPosts);
        // setIsSearching(false);
        return;
      }

      console.log('🔍 Applying search...');
      setIsSearching(true);
      setLoading(true);
      setError(null);

      try {
        const resp = await searchPosts(params);
        console.log('📨 Search response:', resp);

        const postsData = resp.data ?? [];
        console.log('📊 Found posts:', postsData.length);

        setPosts(postsData);
      } catch (error: unknown) {
        setError(getErrorMessage(error, 'Erro ao buscar posts'));
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [allPosts],
  );

  console.log('🎭 Current state:', {
    postsCount: posts.length,
    allPostsCount: allPosts.length,
    loading,
    isSearching,
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Explore o conteúdo disponível</p>
        </div>
        <NewPostButton size="sm" className="min-w-[120px]" />
      </div>

      <PostSearch posts={allPosts} onSearch={handleSearch} loading={loading} />

      <PostsGrid
        posts={posts}
        loading={loading}
        error={error}
        emptyMessage={
          isSearching
            ? 'Nenhum post encontrado com os filtros aplicados.'
            : 'Nenhum conteúdo disponível no momento.'
        }
      />
    </div>
  );
}
