import { z } from "zod";

// Tipos de dados suportados
export const dataTypes = {
  string: "string",
  number: "number",
  boolean: "boolean",
  date: "date",
  email: "email",
  phone: "phone",
  name: "name",
  address: "address",
  company: "company",
  lorem: "lorem",
  uuid: "uuid",
  url: "url",
  ip: "ip",
  color: "color",
  array: "array",
  object: "object"
} as const;

export type DataType = typeof dataTypes[keyof typeof dataTypes];

// Schema para configuração de campo
export const fieldConfigSchema = z.object({
  name: z.string().min(1, "Nome do campo é obrigatório"),
  type: z.enum(Object.values(dataTypes) as [string, ...string[]]),
  required: z.boolean().default(true),
  minLength: z.number().min(1).optional(),
  maxLength: z.number().min(1).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  format: z.string().optional(),
  options: z.array(z.string()).optional(),
  arrayLength: z.number().min(1).max(100).default(5)
});

// Schema para configuração do mock
export const mockConfigSchema = z.object({
  count: z.number().min(1).max(1000).default(10),
  fields: z.array(fieldConfigSchema).min(1, "Pelo menos um campo é obrigatório"),
  format: z.enum(["json", "csv"]).default("json"),
  includeHeaders: z.boolean().default(true)
});

// Schema para resultado do mock
export const mockResultSchema = z.object({
  data: z.array(z.record(z.unknown())),
  count: z.number(),
  format: z.string(),
  timestamp: z.string()
});

export type FieldConfig = z.infer<typeof fieldConfigSchema>;
export type MockConfig = z.infer<typeof mockConfigSchema>;
export type MockResult = z.infer<typeof mockResultSchema>; 