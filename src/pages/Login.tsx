import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/ToastProvider';
import { PasswordInput } from '@/components/ui/password-input';
import { getErrorMessage } from '@/lib/errors';
import loginBg from '@/assets/login-bg.png';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const parallaxFrame = useRef<number | null>(null);
  const { login, isAuthenticating, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleParallax = (event: React.MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    const targetX = ((event.clientX - innerWidth / 2) / innerWidth) * 18;
    const targetY = ((event.clientY - innerHeight / 2) / innerHeight) * 12;

    if (parallaxFrame.current) {
      cancelAnimationFrame(parallaxFrame.current);
    }

    // Suaviza as atualizações para evitar re-render a cada pixel do mouse
    parallaxFrame.current = requestAnimationFrame(() => {
      setParallaxOffset({ x: targetX, y: targetY });
    });
  };

  const resetParallax = () => {
    if (parallaxFrame.current) {
      cancelAnimationFrame(parallaxFrame.current);
    }
    setParallaxOffset({ x: 0, y: 0 });
  };

  // Redireciona se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(
    () => () => {
      if (parallaxFrame.current) {
        cancelAnimationFrame(parallaxFrame.current);
      }
    },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(identifier.trim(), password);
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo ao Ponto de Aula',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: 'Erro ao entrar',
        description: getErrorMessage(error, 'Credenciais inválidas'),
        variant: 'destructive',
      });
    }
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4"
      onMouseMove={handleParallax}
      onMouseLeave={resetParallax}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.55), rgba(30, 58, 138, 0.35)), url(${loginBg})`,
            transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(1.08)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90 backdrop-blur-[2px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border-border/40 bg-card/90 p-8 shadow-2xl backdrop-blur">
        <header className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl">🎓</span>
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Ponto de Aula</p>
          <h1 className="text-2xl font-semibold">Acesse sua conta</h1>
          <p className="text-sm text-muted-foreground">Use o email institucional ou username</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email ou usuário</Label>
            <Input
              id="identifier"
              autoComplete="username"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="admin@pontodeaula.com"
              required
              disabled={isAuthenticating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
            />

          </div>

          <Button type="submit" className="w-full" disabled={isAuthenticating}>
            {isAuthenticating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </>
            )}
          </Button>
        </form>

        {/* Credenciais de teste */}
        <div className="border-t pt-4">
          <p className="mb-2 text-xs text-muted-foreground">Credenciais de teste:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>Admin:</strong> admin@pontodeaula.com / admin@2025 - 12345678
            </p>
            <p>
              <strong>Professor:</strong> teacher@pontodeaula.com / teacher@2025 - 12345678
            </p>
            <p>
              <strong>Aluno:</strong> student@pontodeaula.com / student@2025 - 12345678
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
