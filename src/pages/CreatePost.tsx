import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/ToastProvider';
import { PostForm, type PostFormData } from '@/components/posts/PostForm';
import { createPost } from '@/services/post.service';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '@/lib/errors';

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);

    try {
      const payload = {
        title: data.title,
        content: data.content,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : undefined,
        imageUrl: data.imageUrl || undefined,
        videoUrl: data.videoUrl || undefined,
      };

      await createPost(payload);
      toast({
        title: 'Post criado!',
        description: 'Seu conteúdo foi publicado com sucesso.',
      });
      navigate('/posts/mine');
    } catch (error: unknown) {
      toast({
        title: 'Erro ao criar post',
        description: getErrorMessage(error, 'Não foi possível criar o post.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/posts/mine" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Post</h1>
          <p className="text-muted-foreground">Crie um novo conteúdo</p>
        </div>
      </div>

      <Card className="p-6">
        <PostForm
          onSubmit={handleSubmit}
          isLoading={loading}
          submitLabel="Criar Post"
          onCancel={() => navigate('/posts/mine')}
        />
      </Card>
    </div>
  );
}
