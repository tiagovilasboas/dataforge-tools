import { z } from "zod";

export const svgConverterSchema = z.object({
  svgInput: z.string().min(1, "SVG input is required"),
  componentName: z.string().min(1, "Component name is required").regex(/^[A-Z][a-zA-Z0-9]*$/, "Component name must start with uppercase letter and contain only letters and numbers"),
  includeProps: z.boolean().default(true),
  defaultSize: z.number().min(1).max(1000).default(24),
  defaultColor: z.string().default("currentColor"),
  includeClassName: z.boolean().default(true),
  optimizeSvg: z.boolean().default(true),
  useTypeScript: z.boolean().default(true),
  useNamedExport: z.boolean().default(true),
  removeViewBox: z.boolean().default(false),
  removeDimensions: z.boolean().default(false),
  removeFill: z.boolean().default(false),
  removeStroke: z.boolean().default(false),
  useMemo: z.boolean().default(false),
  useForwardRef: z.boolean().default(false),
  prettier: z.boolean().default(true),
});

export type SvgConverterConfig = z.infer<typeof svgConverterSchema>;

export const svgValidationSchema = z.object({
  svg: z.string().refine((val) => {
    // Basic SVG validation - check if it contains <svg tag
    return val.trim().toLowerCase().includes('<svg');
  }, "Invalid SVG format - must contain <svg> tag"),
});

export type SvgValidation = z.infer<typeof svgValidationSchema>; 