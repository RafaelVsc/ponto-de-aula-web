import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { fetchPosts } from '@/services/post.service';
import type { Post } from '@/types';
import { SquarePlay } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-background p-8">
      <div className="pt-2">
        {loading && <p className="text-sm text-muted-foreground">Carregando posts...</p>}
        {error && <p className="text-sm text-red-500">Erro: {error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum post encontrado.</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {posts.map(post => (
          <Card key={post.id} className="p-4 h-full">
            {/* área fixa da imagem (ex.: URL do Unsplash) */}
            {(post as any).imageUrl ? (
              <div className="w-full h-40 sm:h-48 lg:h-36 bg-gray-100">
                <img
                  src={(post as any).imageUrl}
                  alt={post.title ?? 'Imagem do post'}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-40 sm:h-48 lg:h-36 bg-gray-50 flex items-center justify-center text-sm text-muted-foreground">
                Sem imagem
              </div>
            )}
            {/* h-full para altura igual */}
            <div className="flex flex-col h-full">
              <Link key={post.id} to={`/posts/${post.id}`}>
                <h2 className="text-lg font-semibold">{post.title}</h2>
              </Link>

              {/* corpo flexível que ocupa espaço e aplica ellipsis */}
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1 overflow-hidden">
                {post.content}
              </p>

              {/* footer empilhado verticalmente */}
              <div className="mt-4 flex flex-col gap-1 text-xs text-muted-foreground">
                <span>Escrito por: {(post as any).author ?? 'Autor desconhecido'}</span>

                <span>
                  criado em: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </span>

                {/* ícone / tooltip em linha separada */}
                <div>
                  {(post as any).videoUrl ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <span aria-hidden>
                          <SquarePlay className="w-5 h-5" color="#dc2626" strokeWidth={2} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Conteúdo adicional em vídeo</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span aria-hidden>
                      <SquarePlay className="w-5 h-5" color="#9ca3af" strokeWidth={2} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
