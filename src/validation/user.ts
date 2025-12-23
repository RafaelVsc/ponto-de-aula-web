import * as z from 'zod';

export const userSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    email: z.email('E-mail inválido'),
    username: z.string().min(8, 'Mínimo de 8 caracteres'),
    password: isEdit ? z.string().optional() : z.string().min(8, 'Mínimo de 8 caracteres'),
    role: z.enum(['ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT']),
  });

export type UserFormData = z.infer<ReturnType<typeof userSchema>>;
