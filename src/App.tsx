import { ToastProvider, useToast } from '@/components/ui/ToastProvider';

function TestToastButtons() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-4 p-8 rounded-lg border bg-card">
        <h1 className="text-2xl font-bold mb-4">Teste de Toasts</h1>

        <button
          onClick={() =>
            toast({
              title: 'Sucesso!',
              description: 'Operação concluída com sucesso',
            })
          }
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Toast Normal
        </button>

        <button
          onClick={() =>
            toast({
              title: 'Erro!',
              description: 'Algo deu errado na operação',
              variant: 'destructive',
            })
          }
          className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
        >
          Toast de Erro
        </button>

        <button
          onClick={() =>
            toast({
              title: 'Apenas título',
            })
          }
          className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
        >
          Toast Simples
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <TestToastButtons />
    </ToastProvider>
  );
}

export default App;
