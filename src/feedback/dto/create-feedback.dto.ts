import { z } from 'zod';

export const CreateFeedbackSchema = z.object({
  id_user: z.number().int().positive(),
  id_event: z.number().int().positive(),
  content: z.string().min(3).max(500),
  rate: z.number().min(1).max(5),
  date: z.coerce.date(),
});

export type CreateFeedbackDto = z.infer<typeof CreateFeedbackSchema>;


//z.infer<...> : C'est un utilitaire TypeScript de Zod qui extrait automatiquement le type TypeScript à partir d'un schéma Zod
//typeof CreateFeedbackSchema : Récupère le type du schéma Zod
/* Le résultat
Zod génère automatiquement ce type équivalent :
typescripttype CreateFeedbackDto = {
  id_user: number;
  id_event: number;
  content: string;
  rate: number;
  date: Date;
}
*/