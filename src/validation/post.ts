import * as z from 'zod';
import { stripHtml } from '@/lib/sanitize';

export const postSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .refine(val => stripHtml(val).trim().length > 0, 'Conteúdo é obrigatório'),
  imageUrl: z.url('URL inválida').optional().or(z.literal('')),
  videoUrl: z.url('URL inválida').optional().or(z.literal('')),
  tags: z.string().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

