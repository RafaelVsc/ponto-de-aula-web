import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticating, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(identifier.trim(), password);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao Ponto de Aula",
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro ao entrar",
        description:
          error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary to-muted px-4">
      <Card className="w-full max-w-md space-y-6 rounded-2xl border-border/40 bg-card/90 p-8 shadow-lg backdrop-blur">
        <header className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl">🎓</span>
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Ponto de Aula
          </p>
          <h1 className="text-2xl font-semibold">Acesse sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Use o email institucional ou username
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email ou usuário</Label>
            <Input
              id="identifier"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@pontodeaula.com"
              required
              disabled={isAuthenticating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={isAuthenticating}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isAuthenticating}
          >
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
          <p className="mb-2 text-xs text-muted-foreground">
            Credenciais de teste:
          </p>
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