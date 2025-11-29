import { z } from 'zod';

export const UpdateFeedbackSchema = z.object({
  id_user: z.number().int().positive().optional(),
  id_event: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId').optional(),
  content: z.string().min(3).max(500).optional(),
  rate: z.number().min(1).max(5).optional(),
  date: z.coerce.date().optional(),
});

export type UpdateFeedbackDto = z.infer<typeof UpdateFeedbackSchema>;