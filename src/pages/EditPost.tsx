import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/ToastProvider';
import { PostForm, type PostFormData } from '@/components/posts/PostForm';
import { fetchPostById, updatePostById } from '@/services/post.service';
import type { Post } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        const response = await fetchPostById(id);
        setPost(response.data);
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar post',
          description: error?.message ?? 'Não foi possível carregar o post.',
          variant: 'destructive',
        });
        navigate('/posts/mine');
      } finally {
        setInitializing(false);
      }
    };

    loadPost();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: PostFormData) => {
    if (!id) return;

    setLoading(true);

    try {
      const payload = {
        title: data.title,
        content: data.content,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : undefined,
        imageUrl: data.imageUrl?.trim() || '',
        videoUrl: data.videoUrl?.trim() || '',
      };

      await updatePostById(id, payload);
      toast({
        title: 'Post atualizado!',
        description: 'Suas alterações foram salvas com sucesso.',
      });
      navigate('/posts/mine');
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar post',
        description: error?.message ?? 'Não foi possível atualizar o post.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Carregando post...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/posts/mine" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Editar Post</h1>
          <p className="text-muted-foreground">Atualize seu conteúdo</p>
        </div>
      </div>

      <Card className="p-6">
        <PostForm
          defaultValues={{
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl ?? '',
            videoUrl: post.videoUrl ?? '',
            tags: post.tags?.join(', ') ?? '',
          }}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitLabel="Atualizar Post"
          onCancel={() => navigate('/posts/mine')}
        />
      </Card>
    </div>
  );
}
