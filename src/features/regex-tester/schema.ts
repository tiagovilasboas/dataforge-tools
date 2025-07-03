import { z } from "zod";

// Schema para configuração do regex
export const regexConfigSchema = z.object({
  pattern: z.string().min(1, "Padrão regex é obrigatório"),
  flags: z.string().default("g"),
  testString: z.string().default(""),
  replaceString: z.string().default("")
});

// Schema para resultado do teste
export const regexResultSchema = z.object({
  isValid: z.boolean(),
  matches: z.array(z.object({
    match: z.string(),
    index: z.number(),
    groups: z.array(z.string()).optional()
  })),
  replaceResult: z.string().optional(),
  error: z.string().optional()
});

// Schema para informações do regex
export const regexInfoSchema = z.object({
  pattern: z.string(),
  flags: z.string(),
  description: z.string().optional(),
  examples: z.array(z.string()).optional()
});

export type RegexConfig = z.infer<typeof regexConfigSchema>;
export type RegexResult = z.infer<typeof regexResultSchema>;
export type RegexInfo = z.infer<typeof regexInfoSchema>; 