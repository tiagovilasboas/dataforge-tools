import { z } from "zod";

// Schema flexível para qualquer CSV com campos string
export const csvSchema = z.record(z.string());

// Schema específico para o exemplo (opcional)
export const csvExampleSchema = z.object({
  name: z.string(),
  email: z.string(),
  age: z.string(),
  city: z.string(),
  active: z.string()
}); 