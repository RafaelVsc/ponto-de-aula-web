import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';
import { ModeToggle } from './mode-toggle';

type NavItem = {
  to: string;
  label: string;
  roles?: Role[]; // se ausente -> visível para todos usuários autenticados
};

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/posts/mine', label: 'Meus Posts', roles: ['ADMIN', 'TEACHER', 'SECRETARY'] },
  { to: '/users', label: 'Usuários', roles: ['ADMIN', 'SECRETARY'] },
  { to: '/schedule', label: 'Meus Dados', roles: ['ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT'] },
];

export function Header() {
  const { user, logout } = useAuth();

  const role = user?.role;

  const isVisible = (item: NavItem) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  };

  return (
    <header className="w-full border-b bg-background/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <span className="text-xl">🎓</span>
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <strong className="text-sm">Ponto de Aula</strong>
            <span className="text-xs text-muted-foreground">Painel</span>
          </div>
        </Link>

        <nav className="flex-1 px-6">
          <ul className="flex items-center gap-2">
            {NAV_ITEMS.filter(isVisible).map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-primary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden flex-col text-right sm:block">
            <span className="text-sm">Olá, {user?.name}</span>
          </div>
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
