import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Post, PostSearchParams } from '@/types';

interface PostSearchProps {
  posts: Post[];
  onSearch: (params: PostSearchParams) => void;
  loading?: boolean;
  className?: string;
}

export function PostSearch({ posts, onSearch, loading, className }: PostSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const availableTags = useMemo(() => {
    const tags = posts.flatMap(p => p.tags || []);
    return Array.from(new Set(tags)).sort();
  }, [posts]);

  const availableAuthors = useMemo(() => {
    const seen = new Set<string>();
    return posts
      .map(p => ({ id: p.authorId || '', name: p.author || '' }))
      .filter(a => a.id && a.name && !seen.has(a.id) && seen.add(a.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [posts]);

  const applySearch = (overrides: Partial<PostSearchParams> = {}) => {
    const params: PostSearchParams = {};

    const currentSearch = overrides.search ?? (searchTerm.trim() || undefined);
    const currentTag = overrides.tag ?? (selectedTag.trim() || undefined);
    const currentAuthorId = overrides.authorId ?? (selectedAuthorId || undefined);
    const nextSortBy = overrides.sortBy ?? sortBy;
    const nextSortOrder = overrides.sortOrder ?? sortOrder;

    if (currentSearch) params.search = currentSearch;
    if (currentTag) params.tag = currentTag;
    if (currentAuthorId) params.authorId = currentAuthorId;
    if (nextSortBy !== 'createdAt') params.sortBy = nextSortBy;
    if (nextSortOrder !== 'desc') params.sortOrder = nextSortOrder;

    onSearch(params);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applySearch();
    }
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    applySearch({ tag: tag || undefined });
  };

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthorId(authorId);
    applySearch({ authorId: authorId || undefined });
  };

  const handleSortChange = (newSortBy: 'createdAt' | 'title', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    applySearch({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedAuthorId('');
    setSortBy('createdAt');
    setSortOrder('desc');
    onSearch({});
  };

  const hasActiveFilters =
    searchTerm || selectedTag || selectedAuthorId || sortBy !== 'createdAt' || sortOrder !== 'desc';

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por título ou conteúdo... (Enter para pesquisar)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
          disabled={loading}
        />
        {searchTerm && (
          <>
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <Button
              size="sm"
              onClick={() => applySearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6"
              disabled={loading}
            >
              <Search className="w-3 h-3" />
            </Button>
          </>
        )}
      </div>

      {/* Filtro de Tags */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Tags
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => handleTagChange('')}>Todas as tags</DropdownMenuItem>
          {availableTags.map(tag => (
            <DropdownMenuItem key={tag} onClick={() => handleTagChange(tag)}>
              {tag}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro de Autores */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Autores
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => handleAuthorChange('')}>
            Todos os autores
          </DropdownMenuItem>
          {availableAuthors.map(author => (
            <DropdownMenuItem key={author.id} onClick={() => handleAuthorChange(author.id)}>
              {author.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Ordenação */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={loading}>
            Ordenar por {sortBy === 'createdAt' ? 'Data' : 'Título'}
            {sortOrder === 'desc' ? ' ↓' : ' ↑'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSortChange('createdAt', 'desc')}>
            Mais recentes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('createdAt', 'asc')}>
            Mais antigos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('title', 'asc')}>
            Título A-Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('title', 'desc')}>
            Título Z-A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={resetFilters} disabled={loading}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
