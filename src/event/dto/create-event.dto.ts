import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  date: z.coerce.date(),
  location: z.string().min(3).max(200),
  price: z.number().min(0),
  organizerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
  imageUrl: z.string().url(),
  nbPlaces: z.number().int().min(0),
  nbrLike: z.number().int().min(0).default(0),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;