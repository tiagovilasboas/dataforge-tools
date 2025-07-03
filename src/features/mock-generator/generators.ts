import type { FieldConfig } from "./schema";

// Funções auxiliares para gerar dados falsos
const generateString = (minLength = 5, maxLength = 20): string => {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

const generateNumber = (minValue = 0, maxValue = 1000): number => {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

const generateDate = (): string => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
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
  const name = names[Math.floor(Math.random() * names.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  return `${name} ${surname}`;
};

const generateAddress = (): string => {
  const streets = ['Rua das Flores', 'Avenida Principal', 'Travessa da Paz', 'Rua do Comércio', 'Avenida Central'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number = Math.floor(Math.random() * 1000) + 1;
  return `${street}, ${number}`;
};

const generateCompany = (): string => {
  const companies = ['TechCorp', 'InnoSoft', 'DataFlow', 'CloudTech', 'DevStudio', 'CodeWorks', 'ByteLogic', 'PixelSoft'];
  return companies[Math.floor(Math.random() * companies.length)];
};

const generateLorem = (): string => {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
  const length = Math.floor(Math.random() * 10) + 5;
  return Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
};

const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const generateUrl = (): string => {
  const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.dev'];
  const paths = ['api', 'users', 'products', 'posts', 'comments'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const path = paths[Math.floor(Math.random() * paths.length)];
  return `https://${domain}/${path}`;
};

const generateIp = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

const generateColor = (): string => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateArray = (length: number): unknown[] => {
  return Array.from({ length }, () => generateString());
};

// Função principal para gerar valor baseado no tipo
export const generateValue = (field: FieldConfig): unknown => {
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