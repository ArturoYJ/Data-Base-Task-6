import { z } from 'zod';

export const filtroLibrosSchema = z.object({
  popularidad: z.string().optional(),
});

export const paginacionSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

export const filtroUsuariosSchema = z.object({
  categoria: z.string().optional(),
});