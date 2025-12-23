import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/ToastProvider';
import { PasswordInput } from '@/components/ui/password-input';
import { getApiMessage, getErrorMessage } from '@/lib/errors';
import { createUser, getUserById, updateUserById } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import type { Role, User } from '@/types';
import { getRoleLabel } from '@/lib/roles';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { userSchema, type UserFormData } from '@/validation/user';

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema(isEdit)),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'STUDENT',
    },
  });

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
        form.reset({
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
  }, [form, id, isEdit, navigate, toast]);

  const disabledRoleSelect = isEdit || roleOptions.length === 0;
  const showPasswordField = !isEdit;

  const slugify = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');

  const handleSuggestUsername = () => {
    const currentName = form.getValues('name');
    const currentEmail = form.getValues('email');
    const base = slugify(currentName) || slugify((currentEmail.split('@')[0] || 'user') as string);
    const suffix = Math.floor(Math.random() * 900 + 100).toString(); // 3 dígitos
    const candidate = (base + suffix).slice(0, 12);
    const username = candidate.length < 8 ? candidate.padEnd(8, '0') : candidate;
    form.setValue('username', username, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormData) => {
    setSaving(true);
    try {
      if (isEdit && id) {
        const resp = await updateUserById(id, { name: data.name, email: data.email });
        toast({ title: 'Usuário atualizado', description: resp.data.name });
      } else {
        await createUser({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password ?? '',
          role: data.role,
        });
        toast({ title: 'Usuário criado', description: data.name });
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
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="@pontodeaula.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} minLength={8} disabled={isEdit} className="flex-1" />
                      </FormControl>
                      {!isEdit && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSuggestUsername}
                        >
                          Sugerir
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showPasswordField && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} minLength={8} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select
                        id="role"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...field}
                        disabled={disabledRoleSelect}
                      >
                        {roleOptions.map(role => (
                          <option key={role} value={role}>
                            {getRoleLabel(role)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    {disabledRoleSelect && (
                      <p className="text-xs text-muted-foreground">
                        Role não pode ser alterado nesta edição.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar usuário'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
