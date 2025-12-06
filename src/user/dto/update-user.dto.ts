import { z } from 'zod';

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  role: z.enum(['user', 'organizer', 'admin']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;