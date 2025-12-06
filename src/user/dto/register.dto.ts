import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
  role: z.enum(['user', 'organizer', 'admin']).optional().default('user'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;