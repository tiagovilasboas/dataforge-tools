import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { mockConfigSchema, type MockConfig, type FieldConfig, type MockResult, dataTypes } from "./schema";

// Funções auxiliares para gerar dados falsos
const generateString = (minLength = 5, maxLength = 20): string => {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

const generateNumber = (min = 0, max = 1000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateEmail = (): string => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  const name = generateString(5, 10).toLowerCase();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
};

const generatePhone = (): string => {
  const ddd = Math.floor(Math.random() * 90) + 11;
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `(${ddd}) ${number.toString().slice(0, 4)}-${number.toString().slice(4)}`;
};

const generateName = (): string => {
  const names = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Fernando', 'Juliana', 'Roberto', 'Patricia'];
  const surnames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Gomes'];
  return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
};

const generateAddress = (): string => {
  const streets = ['Rua das Flores', 'Avenida Principal', 'Rua do Comércio', 'Avenida Central', 'Rua da Paz'];
  const numbers = Math.floor(Math.random() * 1000) + 1;
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília'];
  return `${streets[Math.floor(Math.random() * streets.length)]}, ${numbers}, ${cities[Math.floor(Math.random() * cities.length)]}`;
};

const generateCompany = (): string => {
  const companies = ['TechCorp', 'InnovateLab', 'DataFlow', 'CloudTech', 'DigitalSolutions', 'FutureSystems', 'SmartLogic', 'NextGen', 'ProTech', 'EliteSoft'];
  return companies[Math.floor(Math.random() * companies.length)];
};

const generateLorem = (): string => {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
  const length = Math.floor(Math.random() * 10) + 5;
  return Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
};

const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const generateUrl = (): string => {
  const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.dev'];
  const paths = ['api', 'users', 'products', 'posts', 'comments'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const path = paths[Math.floor(Math.random() * paths.length)];
  return `https://${domain}/${path}/${generateString(5, 10)}`;
};

const generateIp = (): string => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
};

const generateColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

const generateDate = (): string => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateArray = (length: number): unknown[] => {
  return Array.from({ length }, () => {
    const types = ['string', 'number', 'boolean'];
    const type = types[Math.floor(Math.random() * types.length)];
    switch (type) {
      case 'string': return generateString();
      case 'number': return generateNumber();
      case 'boolean': return Math.random() > 0.5;
      default: return generateString();
    }
  });
};

// Função principal para gerar valor baseado no tipo
const generateValue = (field: FieldConfig): unknown => {
  const { type, minLength, maxLength, minValue, maxValue, options, arrayLength } = field;

  if (options && options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }

  switch (type) {
    case 'string':
      return generateString(minLength || 5, maxLength || 20);
    case 'number':
      return generateNumber(minValue || 0, maxValue || 1000);
    case 'boolean':
      return Math.random() > 0.5;
    case 'date':
      return generateDate();
    case 'email':
      return generateEmail();
    case 'phone':
      return generatePhone();
    case 'name':
      return generateName();
    case 'address':
      return generateAddress();
    case 'company':
      return generateCompany();
    case 'lorem':
      return generateLorem();
    case 'uuid':
      return generateUuid();
    case 'url':
      return generateUrl();
    case 'ip':
      return generateIp();
    case 'color':
      return generateColor();
    case 'array':
      return generateArray(arrayLength || 5);
    default:
      return generateString();
  }
};

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
        { name: "company", type: "company", required: false, arrayLength: 5 },
        { name: "phone", type: "phone", required: false, arrayLength: 5 },
        { name: "address", type: "address", required: false, arrayLength: 5 },
        { name: "active", type: "boolean", required: true, arrayLength: 5 }
      ],
      format: "json",
      includeHeaders: true
    });
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setErrors([]);
  }, []);

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
    clearResult,
    dataTypes
  };
} 