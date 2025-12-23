import * as z from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Informe e-mail ou username'),
  password: z.string().min(1, 'Informe a senha'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

