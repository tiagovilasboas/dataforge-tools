import type { RegexConfig } from "./schema";

export interface RegexExample {
  name: string;
  config: RegexConfig;
  description: string;
}

export const regexExamples: RegexExample[] = [
  {
    name: "basic",
    config: {
      pattern: "\\b\\w+@\\w+\\.\\w+\\b",
      flags: "g",
      testString: "Contate-nos em john@example.com ou maria@test.org para mais informações.",
      replaceString: "[EMAIL]"
    },
    description: "Regex básico para encontrar emails"
  },
  {
    name: "email",
    config: {
      pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
      flags: "g",
      testString: "Emails: john.doe@example.com, maria@test.org, contato@empresa.com.br, user123@gmail.com",
      replaceString: "[EMAIL]"
    },
    description: "Regex completo para validação de emails"
  },
  {
    name: "phone",
    config: {
      pattern: "\\(\\d{2}\\) \\d{4,5}-\\d{4}",
      flags: "g",
      testString: "Telefones: (11) 99999-9999, (21) 8888-8888, (31) 77777-7777, (41) 3333-3333",
      replaceString: "[PHONE]"
    },
    description: "Regex para telefones brasileiros"
  },
  {
    name: "date",
    config: {
      pattern: "\\d{2}/\\d{2}/\\d{4}",
      flags: "g",
      testString: "Datas: 25/12/2023, 01/01/2024, 15/03/2024, 30/06/2024",
      replaceString: "[DATE]"
    },
    description: "Regex para datas no formato DD/MM/YYYY"
  },
  {
    name: "url",
    config: {
      pattern: "https?://[^\\s]+",
      flags: "g",
      testString: "Links: https://example.com, http://test.org, https://github.com/user/repo",
      replaceString: "[URL]"
    },
    description: "Regex para URLs HTTP/HTTPS"
  },
  {
    name: "cpf",
    config: {
      pattern: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
      flags: "g",
      testString: "CPFs: 123.456.789-00, 987.654.321-11, 111.222.333-44",
      replaceString: "[CPF]"
    },
    description: "Regex para CPF brasileiro"
  },
  {
    name: "cep",
    config: {
      pattern: "\\d{5}-\\d{3}",
      flags: "g",
      testString: "CEPs: 12345-678, 98765-432, 11111-222",
      replaceString: "[CEP]"
    },
    description: "Regex para CEP brasileiro"
  },
  {
    name: "time",
    config: {
      pattern: "\\d{2}:\\d{2}(:\\d{2})?",
      flags: "g",
      testString: "Horários: 14:30, 09:15:45, 23:59, 00:00:00",
      replaceString: "[TIME]"
    },
    description: "Regex para horários HH:MM ou HH:MM:SS"
  },
  {
    name: "ip",
    config: {
      pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
      flags: "g",
      testString: "IPs: 192.168.1.1, 10.0.0.1, 172.16.0.1, 8.8.8.8",
      replaceString: "[IP]"
    },
    description: "Regex para endereços IPv4"
  },
  {
    name: "creditCard",
    config: {
      pattern: "\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b",
      flags: "g",
      testString: "Cartões: 1234 5678 9012 3456, 9876-5432-1098-7654",
      replaceString: "[CARD]"
    },
    description: "Regex para números de cartão de crédito"
  },
  {
    name: "htmlTag",
    config: {
      pattern: "<[^>]+>",
      flags: "g",
      testString: "HTML: <div>conteúdo</div>, <span class=\"test\">texto</span>, <br/>",
      replaceString: "[TAG]"
    },
    description: "Regex para tags HTML"
  },
  {
    name: "camelCase",
    config: {
      pattern: "\\b[a-z]+(?:[A-Z][a-z]+)*\\b",
      flags: "g",
      testString: "Variáveis: userName, firstName, lastName, emailAddress, phoneNumber",
      replaceString: "[CAMEL]"
    },
    description: "Regex para camelCase"
  },
  {
    name: "snakeCase",
    config: {
      pattern: "\\b[a-z]+(?:_[a-z]+)*\\b",
      flags: "g",
      testString: "Variáveis: user_name, first_name, last_name, email_address, phone_number",
      replaceString: "[SNAKE]"
    },
    description: "Regex para snake_case"
  },
  {
    name: "hexColor",
    config: {
      pattern: "#[0-9A-Fa-f]{6}",
      flags: "g",
      testString: "Cores: #FF0000, #00FF00, #0000FF, #FFFFFF, #000000",
      replaceString: "[COLOR]"
    },
    description: "Regex para cores hexadecimais"
  }
];

export const getExampleByName = (name: string): RegexExample | undefined => {
  return regexExamples.find(example => example.name === name);
}; 