import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';
import { ModeToggle } from './mode-toggle';
import { Menu, X, LogOut } from 'lucide-react';

type NavItem = {
  to: string;
  label: string;
  roles?: Role[]; // se ausente -> visível para todos usuários autenticados
};

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/posts/mine', label: 'Meus Posts', roles: ['ADMIN', 'TEACHER', 'SECRETARY'] },
  { to: '/users', label: 'Usuários', roles: ['ADMIN', 'SECRETARY'] },
  { to: '/profile', label: 'Meus Dados', roles: ['ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT'] },
];

export function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role;

  const isVisible = (item: NavItem) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  };

  return (
    <header className="w-full border-b bg-background/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <span className="text-xl">🎓</span>
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <strong className="text-sm">Ponto de Aula</strong>
            <span className="text-xs text-muted-foreground">Painel</span>
          </div>
        </Link>

        <nav
          className={`order-3 -mx-2 w-full ${menuOpen ? 'flex border border-border bg-background p-3 rounded-md' : 'hidden'} flex-col overflow-x-auto px-2 sm:order-none sm:mx-0 sm:flex sm:flex-1 sm:overflow-visible sm:border-0 sm:bg-transparent sm:p-0 sm:px-6`}
        >
          <ul className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-start sm:gap-3">
            {NAV_ITEMS.filter(isVisible).map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-xs sm:text-sm px-2 py-1 rounded whitespace-nowrap ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-primary'
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex flex-1 items-center gap-2 sm:hidden">
            <span className="truncate text-xs text-muted-foreground">Olá, {user?.name}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <div className="hidden flex-col text-right leading-tight sm:flex">
            <span className="text-sm">Olá, {user?.name}</span>
            {/* <span className="text-xs text-muted-foreground">{user?.role}</span> */}
          </div>
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
