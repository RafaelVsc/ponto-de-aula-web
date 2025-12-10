import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCan } from '@/hooks/useCan';
import { getYouTubeEmbedUrl } from '@/lib/normalizeVideoUrl';
import { deletePostById, fetchPostById } from '@/services/post.service';
import type { Post } from '@/types';
import { ArrowLeft, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import defaultPostImage from '@/assets/login-bg.png';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/hooks/useAuth';

export default function PostDetail() {
  const {user} = useAuth();
  const can = useCan();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const postId = id;
    if (!postId) {
      setError('Post não encontrado.');
      return;
    }

    let mounted = true;

    (async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchPostById(postId);
        if (!mounted) return;
        setPost(resp.data ?? null);
      } catch (error: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(error, 'Erro ao carregar seus posts'));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-sm text-red-500">Erro: {error}</p>
        <Link to="/" className="text-sm text-primary hover:underline mt-4 inline-block">
          ← Voltar para o início
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-sm text-muted-foreground">Post não encontrado.</p>
        <Link to="/" className="text-sm text-primary hover:underline mt-4 inline-block">
          ← Voltar para o início
        </Link>
      </div>
    );
  }

  const isOwner = post?.authorId === user?.id;
  const canUpdate = (can?.('update', 'Post', post) ?? false) && isOwner;
  const canDelete = can?.('delete', 'Post', post) ?? false;
  const hasActions = canUpdate || canDelete;

  const videoUrl = post.videoUrl;

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  // Determinar qual data mostrar
  const wasUpdated = post.updatedAt && post.updatedAt !== post.createdAt;
  const displayDate = wasUpdated ? post.updatedAt : post.createdAt;

  async function handleDelete() {
    if (!post) return;
    try {
      await deletePostById(post.id);
      navigate('/');
    } catch (error: unknown) {
      let message = 'Erro desconhecido';
      if (error instanceof Error) {
        message = error.message;
      }
      alert('Erro ao deletar post: ' + message);
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <Card className="p-0 overflow-hidden max-w-4xl mx-auto">
        <div className="w-full h-64 md:h-96 bg-gray-100">
          <img
            src={post.imageUrl || defaultPostImage}
            alt={post.title ?? 'Imagem do post'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
            <span>{post.author ?? 'Autor desconhecido'}</span>
            <span>•</span>

            {wasUpdated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 cursor-help group">
                    <time dateTime={displayDate}>
                      atualizado em{' '}
                      {new Date(displayDate!).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                    <Info className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Publicado em{' '}
                    {new Date(post.createdAt!).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <time dateTime={displayDate}>
                {displayDate
                  ? new Date(displayDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : ''}
              </time>
            )}
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
          {embedUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Vídeo complementar</h2>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  title="Vídeo do post"
                  className="w-full h-full"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          {/* Botões de ação para quem pode editar/deletar */}
          {hasActions && (
          <div className="flex gap-4 mt-8">
            {canUpdate && (
              <Button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => navigate(`/posts/edit/${post.id}`)}
              >
                Editar
              </Button>
            )}

            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    Deletar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar deleção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          )}
          {/* <div className="flex gap-4 mt-8">
            {can && can('update', 'Post', post) && (
              <Button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => navigate(`/posts/edit/${post.id}`)}
              >
                Editar
              </Button>
            )}

            {can && can('delete', 'Post', post) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    Deletar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar deleção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div> */}
        </div>
      </Card>
    </div>
  );
}
