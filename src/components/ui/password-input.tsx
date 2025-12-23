import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  label?: React.ReactNode;
};

export function PasswordInput({
  label,
  className,
  placeholder = '••••••••',
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      {label}
      <div className="relative">
        <Input
          {...props}
          placeholder={placeholder}
          type={visible ? 'text' : 'password'}
          className={`pr-10 ${className ?? ''}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
