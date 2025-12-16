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
import { sanitizeHtml } from '@/lib/sanitize';
import { useToast } from '@/components/ui/ToastProvider';

export default function PostDetail() {
  const { user } = useAuth();
  const can = useCan();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
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
      <div className="min-h-screen bg-background px-4 py-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:p-8">
        <p className="text-sm text-red-500">Erro: {error}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Voltar para o início
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Post não encontrado.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  async function handleDelete() {
    if (!post) return;
    try {
      await deletePostById(post.id);
      navigate('/');
    } catch (error: unknown) {
      toast({
        title: 'Erro ao deletar post',
        description: getErrorMessage(error, 'Não foi possível excluir o post.'),
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="bg-background px-4 py-6 sm:min-h-screen sm:p-8">
      <button
        type="button"
        onClick={handleBack}
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <Card className="mx-auto max-w-4xl overflow-hidden p-0">
        <div className="h-48 w-full bg-gray-100 sm:h-64 md:h-96">
          <img
            src={post.imageUrl || defaultPostImage}
            alt={post.title ?? 'Imagem do post'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
            {post.title}
          </h1>
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mb-6 flex flex-wrap items-center gap-2 border-b pb-4 text-sm text-muted-foreground sm:gap-4 sm:pb-6">
            <span>{post.author ?? 'Autor desconhecido'}</span>
            <span>•</span>

            {wasUpdated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="group inline-flex cursor-help items-center gap-1.5">
                    <time dateTime={displayDate}>
                      atualizado em{' '}
                      {new Date(displayDate!).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                    <Info className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
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
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
          {embedUrl && (
            <div className="mt-6 sm:mt-8">
              <h2 className="mb-4 text-xl font-semibold">Vídeo complementar</h2>
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                <iframe
                  src={embedUrl}
                  title="Vídeo do post"
                  className="h-full w-full"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          {/* Botões de ação para quem pode editar/deletar */}
          {hasActions && (
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              {canUpdate && (
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/posts/edit/${post.id}`)}
                >
                  Editar
                </Button>
              )}

              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto"
                      variant="destructive"
                    >
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
        </div>
      </Card>
    </div>
  );
}
