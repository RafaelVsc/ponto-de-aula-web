import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getApiMessage, getErrorMessage } from '@/lib/errors';
import { listUsers, deleteUserById } from '@/services/user.service';
import type { User, Role } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import { getRoleLabel } from '@/lib/roles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const canManageAll = currentUser?.role === 'ADMIN';
  const canManageLimited = currentUser?.role === 'SECRETARY';
  const canAccess = canManageAll || canManageLimited;

  useEffect(() => {
    (async () => {
      if (!canAccess) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await listUsers();
        setUsers(resp.data ?? []);
      } catch (err) {
        const msg = getApiMessage(err, getErrorMessage(err, 'Não foi possível carregar usuários'));
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [canAccess]);

  const canManageRole = (role: User['role']) =>
    canManageAll || (canManageLimited && (role === 'TEACHER' || role === 'STUDENT'));

  const filteredUsers = users.filter(u => {
    if (u.id === currentUser?.id) return false; // não renderiza a linha do usuário logado
    if (!canManageRole(u.role)) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    return true;
  });

  const availableRoleFilters: (Role | 'ALL')[] = useMemo(() => {
    const base: (Role | 'ALL')[] = canManageAll
      ? ['ALL', 'ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT']
      : ['ALL', 'TEACHER', 'STUDENT'];
    return base;
  }, [canManageAll]);
  const searchedUsers = filteredUsers.filter(u => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.username ?? '').toLowerCase().includes(term)
    );
  });

  const handleNavigateNew = () => navigate('/users/new');
  const handleNavigateEdit = (id: string) => navigate(`/users/edit/${id}`);
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUserById(deleteTarget.id);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    } catch (err) {
      const msg = getApiMessage(err, getErrorMessage(err, 'Não foi possível excluir o usuário'));
      setError(msg);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2 w-full sm:w-auto sm:justify-end">
          <Input
            placeholder="Buscar por nome, email ou username"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-44 justify-start"
                disabled={!canAccess}
              >
                <Filter className="w-4 h-4 mr-2" />
                {getRoleLabel(roleFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {availableRoleFilters.map(role => (
                <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                  {getRoleLabel(role)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {canAccess && (
            <Button size="sm" className="w-full sm:w-auto min-w-[120px]" onClick={handleNavigateNew}>
              Novo usuário
            </Button>
          )}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {!canAccess ? (
          <div className="p-4 text-sm text-muted-foreground">
            Você não tem permissão para visualizar usuários.
          </div>
        ) : loading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando usuários...</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">Erro: {error}</div>
        ) : searchedUsers.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">Nenhum usuário encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registrado</TableHead>
                  {canAccess && <TableHead className="w-32 text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.username ?? '—'}</TableCell>
                    <TableCell>{getRoleLabel(u.role)}</TableCell>
                    <TableCell>
                      {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('pt-BR') : '—'}
                    </TableCell>
                    {canManageRole(u.role) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleNavigateEdit(u.id)}
                          >
                            Editar
                          </Button>
                          {canManageAll && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteTarget(u)}
                            >
                              Excluir
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.name}"? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
