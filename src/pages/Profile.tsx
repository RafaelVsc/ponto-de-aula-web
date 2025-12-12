import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/ToastProvider';
import { getMe, updateMe, changeMyPassword } from '@/services/user.service';
import { getErrorMessage, getApiMessage } from '@/lib/errors';
import type { User } from '@/types';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [draft, setDraft] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const resp = await getMe();
        setUser(resp.data);
        setDraft({ name: resp.data.name, email: resp.data.email });
      } catch (err) {
        toast({
          title: 'Erro',
          description: getErrorMessage(err, 'Não foi possível carregar seu perfil'),
          variant: 'destructive',
        });
      }
    })();
  }, [toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const resp = await updateMe({ name: draft.name, email: draft.email });
      setUser(resp.data);
      setEditMode(false);
      toast({ title: 'Perfil atualizado' });
    } catch (err) {
      toast({
        title: 'Erro ao atualizar',
        description: getApiMessage(err, 'Falha ao atualizar perfil'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement)?.value ?? '';
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement)?.value ?? '';
    setChangingPwd(true);
    try {
      await changeMyPassword({ currentPassword, newPassword });
      form.reset();
      toast({ title: 'Senha alterada' });
      setShowChangePwd(false);
    } catch (err) {
      toast({
        title: 'Erro ao alterar senha',
        description: getApiMessage(err, 'Falha ao alterar senha'),
        variant: 'destructive',
      });
    } finally {
      setChangingPwd(false);
    }
  };

  if (!user) return <p className="text-sm text-muted-foreground p-4">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus dados</h1>

      <Card className="p-6 space-y-4">
        {!editMode && (
          <>
            <div className="space-y-1">
              <p>
                <strong>Nome:</strong> {user.name}
              </p>
              <p>
                <strong>E-mail:</strong> {user.email}
              </p>
            </div>
            <Button onClick={() => setEditMode(true)}>Editar dados</Button>
          </>
        )}

        {editMode && (
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={e => setDraft({ ...draft, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={draft.email}
                onChange={e => setDraft({ ...draft, email: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDraft({ name: user.name, email: user.email });
                  setEditMode(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Alterar senha</h2>
          <Button variant="outline" size="sm" onClick={() => setShowChangePwd(prev => !prev)}>
            {showChangePwd ? 'Fechar' : 'Abrir'}
          </Button>
        </div>
        {showChangePwd && (
          <form className="space-y-3" onSubmit={handleChangePassword}>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input id="newPassword" name="newPassword" type="password" minLength={8} required />
            </div>
            <Button type="submit" disabled={changingPwd}>
              {changingPwd ? 'Alterando...' : 'Alterar senha'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
