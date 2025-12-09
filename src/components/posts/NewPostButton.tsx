import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = { size?: 'sm' | 'default'; className?: string };

export function NewPostButton({ size = 'sm', className }: Props) {
  const navigate = useNavigate();
  return (
    <Button size={size} className={className} onClick={() => navigate('/posts/new')}>
      <Plus className="w-4 h-4 mr-2" />
      Novo Post
    </Button>
  );
}
