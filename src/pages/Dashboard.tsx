import { PostsGrid } from '@/components/posts/PostGrid';
import { fetchPosts } from '@/services/post.service';
import type { Post } from '@/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchPosts();
        console.log('fetchPosts response:', resp);
        if (!mounted) return;
        setPosts(resp.data ?? []);
        console.log('posts (state will be):', resp.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? 'Erro ao carregar posts');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Explore o conteúdo disponível</p>
        </div>
        <Button onClick={() => navigate('/posts/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Post
        </Button>
      </div>


      <PostsGrid
        posts={posts}
        loading={loading}
        error={error}
        emptyMessage="Nenhum conteúdo disponível no momento."
      />
    </div>
  );
}
