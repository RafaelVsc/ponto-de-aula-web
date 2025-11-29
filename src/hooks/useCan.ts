import { policies } from '@/lib/policies';
import type { Action, Subject } from '@/lib/policies';
import { useAuth } from './useAuth';

/**
 * Hook customizado para verificar as permissões do usuário.
 * Ele retorna uma função 'check' para ser usada nos componentes.
 * Exemplo de uso: const can = useCan(); if (can('update', 'Post', postData)) { ... }
 */
export const useCan = () => {
  // const { user } = useAuth();
  const authContext = useAuth();

  if (!authContext || !authContext.user) {
    // Correção: Sempre retorna uma função.
    return () => false;
  }

  const user = authContext.user; // Defina user aqui!

  const check = (action: Action, subject: Subject, subjectData?: any): boolean => {
    const userPolicy = policies[user.role];

    if (!userPolicy) {
      return false;
    }

    if (userPolicy.static.all?.includes('manage')) {
      return true;
    }

    if (userPolicy.static[subject]?.includes(action)) {
      return true;
    }

    const dynamicRule = userPolicy.dynamic?.[subject]?.[action];
    if (dynamicRule) {
      return dynamicRule(user, subjectData);
    }

    return false;
  };
  return check;
};
