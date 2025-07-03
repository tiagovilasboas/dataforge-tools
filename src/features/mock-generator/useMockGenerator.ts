import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { mockConfigSchema, type MockConfig, type MockResult, type FieldConfig } from "./schema";
import { generateValue } from "./generators";

export function useMockGenerator() {
  const [config, setConfig] = useState<MockConfig>({
    count: 10,
    fields: [
      { name: "id", type: "number", required: true, arrayLength: 5 },
      { name: "name", type: "name", required: true, arrayLength: 5 },
      { name: "email", type: "email", required: true, arrayLength: 5 }
    ],
    format: "json",
    includeHeaders: true
  });
  const [result, setResult] = useState<MockResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const generateMock = useCallback(() => {
    try {
      // Valida configuração
      mockConfigSchema.parse(config);
      
      // Gera dados
      const data = Array.from({ length: config.count }, () => {
        const item: Record<string, unknown> = {};
        config.fields.forEach(field => {
          if (field.required || Math.random() > 0.2) { // 80% chance de incluir campos opcionais
            item[field.name] = generateValue(field);
          }
        });
        return item;
      });

      const mockResult: MockResult = {
        data,
        count: config.count,
        format: config.format,
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);
      setErrors([]);
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map((err) => `${err.path.join(".")} → ${err.message}`));
      } else {
        setErrors(["Erro inesperado ao gerar dados"]);
      }
      setResult(null);
    }
  }, [config]);

  const addField = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, { name: `field${prev.fields.length + 1}`, type: "string", required: true, arrayLength: 5 }]
    }));
  }, []);

  const removeField = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  }, []);

  const updateField = useCallback((index: number, field: Partial<FieldConfig>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
    }));
  }, []);

  const loadSample = useCallback(() => {
    setConfig({
      count: 5,
      fields: [
        { name: "id", type: "number", required: true, arrayLength: 5 },
        { name: "name", type: "name", required: true, arrayLength: 5 },
        { name: "email", type: "email", required: true, arrayLength: 5 },
        { name: "phone", type: "phone", required: false, arrayLength: 5 },
        { name: "company", type: "company", required: false, arrayLength: 5 }
      ],
      format: "json",
      includeHeaders: true
    });
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!result) return;
    
    try {
      const text = config.format === "json" 
        ? JSON.stringify(result.data, null, 2)
        : result.data.map(row => Object.values(row).join(",")).join("\n");
      
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [result, config.format]);

  const downloadData = useCallback(() => {
    if (!result) return;
    
    const text = config.format === "json" 
      ? JSON.stringify(result.data, null, 2)
      : result.data.map(row => Object.values(row).join(",")).join("\n");
    
    const blob = new Blob([text], { 
      type: config.format === "json" ? "application/json" : "text/csv" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${config.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, config.format]);

  return {
    config,
    setConfig,
    result,
    errors,
    generateMock,
    addField,
    removeField,
    updateField,
    loadSample,
    copyToClipboard,
    downloadData
  };
} 