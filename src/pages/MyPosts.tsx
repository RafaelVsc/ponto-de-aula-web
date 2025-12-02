import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PostsGrid } from '@/components/posts/PostGrid';
import { useToast } from '@/components/ui/ToastProvider';
import { fetchMyPosts, deletePostById } from '@/services/post.service';
import type { Post } from '@/types';
import { Plus } from 'lucide-react';
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

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchMyPosts();
      setPosts(resp.data ?? []);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao carregar seus posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleEdit = (post: Post) => {
    navigate(`/posts/${post.id}/edit`);
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
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error?.message ?? 'Não foi possível excluir o post.',
        variant: 'destructive',
      });
    } finally {
      setDeletePost(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Meus Posts</h1>
          <p className="text-muted-foreground">Gerencie seus conteúdos</p>
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
        showActions={true}
        onEdit={handleEdit}
        onDelete={setDeletePost}
        emptyMessage="Você ainda não criou nenhum post. Que tal começar agora?"
      />

      {/* Dialog de confirmação de exclusão */}
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
