import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type Props = {
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function PostDetailActions({ canUpdate, canDelete, onEdit, onDelete }: Props) {
  if (!canUpdate && !canDelete) return null;

  return (
    <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
      {canUpdate && (
        <Button size="sm" className="w-full sm:w-auto" onClick={onEdit}>
          Editar
        </Button>
      )}

      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto" variant="destructive">
              Deletar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar deleção</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
