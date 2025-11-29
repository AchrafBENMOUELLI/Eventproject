import { z } from 'zod';

export const UpdateEventSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  date: z.coerce.date().optional(),
  location: z.string().min(3).max(200).optional(),
  price: z.number().min(0).optional(),
  organizerId: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  nbPlaces: z.number().int().min(0).optional(),
  nbrLike: z.number().int().min(0).optional(),
});

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;