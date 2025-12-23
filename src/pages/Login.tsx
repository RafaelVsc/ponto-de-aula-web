import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/ToastProvider';
import { PasswordInput } from '@/components/ui/password-input';
import { getErrorMessage } from '@/lib/errors';
import loginBg from '@/assets/login-bg.png';
import { useParallaxBackground } from '@/hooks/useParallaxBackground';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/validation/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function Login() {
  const { bgRef, handleParallax, resetParallax } = useParallaxBackground();
  const { login, isAuthenticating, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  // Redireciona se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data.identifier.trim(), data.password);
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
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.55), rgba(30, 58, 138, 0.35)), url(${loginBg})`,
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ou usuário</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      placeholder="admin@pontodeaula.com"
                      {...field}
                      disabled={isAuthenticating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      name="password"
                      autoComplete="current-password"
                      minLength={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>

        {/* Credenciais de teste */}
        <div className="border-t pt-4">
          <p className="mb-2 text-xs text-muted-foreground">Credenciais de teste:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>Admin:</strong> admin@pontodeaula.com / admin2025 - 12345678
            </p>
            <p>
              <strong>Secretaria:</strong> secretaria@pontodeaula.com.br / secretary2025 - 12345678
            </p>
            <p>
              <strong>Professor:</strong> teacher@pontodeaula.com / teacher2025 - 12345678
            </p>
            <p>
              <strong>Aluno:</strong> student@pontodeaula.com / student2025 - 12345678
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
