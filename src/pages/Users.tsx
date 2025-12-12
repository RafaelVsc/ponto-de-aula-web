import { useEffect, useState } from 'react';
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
import { listUsers } from '@/services/user.service';
import type { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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

  const filteredUsers = users.filter(u => canManageRole(u.role));

  const handleNavigateNew = () => navigate('/users/new');
  const handleNavigateEdit = (id: string) => navigate(`/users/edit/${id}`);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        {canAccess && (
          <Button size="sm" className="min-w-[120px]" onClick={handleNavigateNew}>
            Novo usuário
          </Button>
        )}
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
        ) : filteredUsers.length === 0 ? (
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
                {filteredUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.username ?? '—'}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      {u.registeredAt
                        ? new Date(u.registeredAt).toLocaleDateString('pt-BR')
                        : '—'}
                    </TableCell>
                    {canManageRole(u.role) && (
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleNavigateEdit(u.id)}>
                          Editar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
