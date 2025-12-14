import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/ToastProvider';
import { PasswordInput } from '@/components/ui/password-input';
import { getApiMessage, getErrorMessage } from '@/lib/errors';
import { createUser, getUserById, updateUserById } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import type { Role, User } from '@/types';
import { getRoleLabel } from '@/lib/roles';
import { ArrowLeft } from 'lucide-react';

type FormState = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  username: '',
  password: '',
  role: 'STUDENT',
};

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const roleOptions: Role[] = useMemo(() => {
    if (currentUser?.role === 'ADMIN') return ['ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT'];
    if (currentUser?.role === 'SECRETARY') return ['TEACHER', 'STUDENT'];
    return [];
  }, [currentUser?.role]);

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    (async () => {
      try {
        const resp = await getUserById(id);
        const u: User = resp.data;
        setForm({
          name: u.name,
          email: u.email,
          username: u.username ?? '',
          password: '',
          role: u.role,
        });
      } catch (err) {
        toast({
          title: 'Erro',
          description: getApiMessage(
            err,
            getErrorMessage(err, 'Não foi possível carregar usuário'),
          ),
          variant: 'destructive',
        });
        navigate('/users', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate, toast]);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && id) {
        const resp = await updateUserById(id, { name: form.name, email: form.email });
        toast({ title: 'Usuário atualizado', description: resp.data.name });
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          role: form.role,
        });
        toast({ title: 'Usuário criado', description: form.name });
      }
      navigate('/users');
    } catch (err) {
      toast({
        title: 'Erro ao salvar usuário',
        description: getApiMessage(err, getErrorMessage(err, 'Falha ao salvar usuário')),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const disabledRoleSelect = isEdit || roleOptions.length === 0;
  const showPasswordField = !isEdit;

  const slugify = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');

  const handleSuggestUsername = () => {
    const base = slugify(form.name) || slugify(form.email.split('@')[0] || 'user');
    const suffix = Math.floor(Math.random() * 900 + 100).toString(); // 3 dígitos
    const candidate = (base + suffix).slice(0, 12);
    const username = candidate.length < 8 ? candidate.padEnd(8, '0') : candidate;
    setForm(prev => ({ ...prev, username }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/users" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'Editar usuário' : 'Novo usuário'}</h1>
          <p className="text-muted-foreground">
            {isEdit
              ? 'Atualize os dados do usuário'
              : 'Preencha as informações para criar um usuário'}
          </p>
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando usuário...</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={form.name} onChange={handleChange('name')} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="@pontodeaula.com.br"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex gap-2">
                <Input
                  id="username"
                  value={form.username}
                  onChange={handleChange('username')}
                  minLength={8}
                  required
                  disabled={isEdit}
                  className="flex-1"
                />
                {!isEdit && (
                  <Button type="button" variant="outline" size="sm" onClick={handleSuggestUsername}>
                    Sugerir
                  </Button>
                )}
              </div>
            </div>

            {showPasswordField && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  minLength={8}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.role}
                onChange={handleChange('role')}
                disabled={disabledRoleSelect}
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
              {disabledRoleSelect && (
                <p className="text-xs text-muted-foreground">
                  Role não pode ser alterado nesta edição.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar usuário'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
