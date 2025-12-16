import { NewPostButton } from '@/components/posts/NewPostButton';
import { PostsGrid } from '@/components/posts/PostGrid';
import { PostTable } from '@/components/posts/PostTable';
import { PostSearch } from '@/components/posts/PostSearch';
import { ViewModeToggle } from '@/components/posts/ViewModeToggle';
import { useViewMode } from '@/hooks/useViewMode';
import { useAuth } from '@/hooks/useAuth';
import { Pagination } from '@/components/ui/pagination';
import { usePagedPosts } from '@/hooks/usePagedPosts';

const VIEW_MODE_KEY = 'pda:viewMode:dashboard';

export default function Dashboard() {
  const { viewMode, changeView } = useViewMode(VIEW_MODE_KEY, 'grid');
  const { user } = useAuth();
  const {
    posts,
    filterOptions: filterOptionsPosts,
    page,
    hasNextPage,
    loading,
    error,
    hasActiveFilters,
    handleSearch,
    handlePrevPage,
    handleNextPage,
  } = usePagedPosts();

  const canCreatePost =
    user?.role === 'ADMIN' || user?.role === 'SECRETARY' || user?.role === 'TEACHER';
  const emptyMessage = hasActiveFilters
    ? 'Nenhum post encontrado com os filtros aplicados.'
    : 'Nenhum conteúdo disponível no momento.';

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
