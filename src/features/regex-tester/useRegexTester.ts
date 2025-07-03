import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { regexConfigSchema, type RegexConfig, type RegexResult } from "./schema";

export function useRegexTester() {
  const [config, setConfig] = useState<RegexConfig>({
    pattern: "",
    flags: "g",
    testString: "",
    replaceString: ""
  });
  const [result, setResult] = useState<RegexResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const testRegex = useCallback(() => {
    if (!config.pattern.trim()) {
      setErrors(["Padrão regex é obrigatório"]);
      setResult(null);
      return;
    }

    try {
      // Valida configuração
      regexConfigSchema.parse(config);
      
      // Cria regex
      const regex = new RegExp(config.pattern, config.flags);
      
      // Testa matches
      const matches: RegexResult['matches'] = [];
      let match;
      
      if (config.testString) {
        while ((match = regex.exec(config.testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // Evita loop infinito se não há flag global
          if (!config.flags.includes('g')) break;
        }
      }

      // Testa substituição
      let replaceResult: string | undefined;
      if (config.testString && config.replaceString) {
        replaceResult = config.testString.replace(regex, config.replaceString);
      }

      const regexResult: RegexResult = {
        isValid: true,
        matches,
        replaceResult
      };

      setResult(regexResult);
      setErrors([]);
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map((err) => `${err.path.join(".")} → ${err.message}`));
      } else if (e instanceof SyntaxError) {
        setErrors([`Regex inválido: ${e.message}`]);
      } else {
        setErrors(["Erro inesperado ao testar regex"]);
      }
      setResult(null);
    }
  }, [config]);

  const clearResult = useCallback(() => {
    setResult(null);
    setErrors([]);
  }, []);

  const loadSample = useCallback(() => {
    setConfig({
      pattern: "\\b\\w+@\\w+\\.\\w+\\b",
      flags: "g",
      testString: "Contate-nos em john@example.com ou maria@test.org para mais informações.",
      replaceString: "[EMAIL]"
    });
  }, []);

  const loadEmailSample = useCallback(() => {
    setConfig({
      pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
      flags: "g",
      testString: "Emails: john.doe@example.com, maria@test.org, contato@empresa.com.br, user123@gmail.com",
      replaceString: "[EMAIL]"
    });
  }, []);

  const loadPhoneSample = useCallback(() => {
    setConfig({
      pattern: "\\(\\d{2}\\) \\d{4,5}-\\d{4}",
      flags: "g",
      testString: "Telefones: (11) 99999-9999, (21) 8888-8888, (31) 77777-7777, (41) 3333-3333",
      replaceString: "[PHONE]"
    });
  }, []);

  const loadDateSample = useCallback(() => {
    setConfig({
      pattern: "\\d{2}/\\d{2}/\\d{4}",
      flags: "g",
      testString: "Datas: 25/12/2023, 01/01/2024, 15/03/2024, 30/06/2024",
      replaceString: "[DATE]"
    });
  }, []);

  const loadUrlSample = useCallback(() => {
    setConfig({
      pattern: "https?://[^\\s]+",
      flags: "g",
      testString: "Links: https://example.com, http://test.org, https://github.com/user/repo",
      replaceString: "[URL]"
    });
  }, []);

  const loadWordSample = useCallback(() => {
    setConfig({
      pattern: "\\b\\w{4,}\\b",
      flags: "g",
      testString: "Encontre palavras com 4 ou mais letras neste texto de exemplo.",
      replaceString: "[WORD]"
    });
  }, []);

  const loadNumberSample = useCallback(() => {
    setConfig({
      pattern: "\\b\\d+\\b",
      flags: "g",
      testString: "Números: 123, 456, 789, 42, 1000, 999",
      replaceString: "[NUMBER]"
    });
  }, []);

  const loadCpfSample = useCallback(() => {
    setConfig({
      pattern: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
      flags: "g",
      testString: "CPFs: 123.456.789-00, 987.654.321-11, 111.222.333-44",
      replaceString: "[CPF]"
    });
  }, []);

  const loadCepSample = useCallback(() => {
    setConfig({
      pattern: "\\d{5}-\\d{3}",
      flags: "g",
      testString: "CEPs: 12345-678, 98765-432, 11111-222",
      replaceString: "[CEP]"
    });
  }, []);

  const loadTimeSample = useCallback(() => {
    setConfig({
      pattern: "\\d{2}:\\d{2}(:\\d{2})?",
      flags: "g",
      testString: "Horários: 14:30, 09:15, 23:45:30, 12:00",
      replaceString: "[TIME]"
    });
  }, []);

  const loadIpSample = useCallback(() => {
    setConfig({
      pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
      flags: "g",
      testString: "IPs: 192.168.1.1, 10.0.0.1, 172.16.0.1, 8.8.8.8",
      replaceString: "[IP]"
    });
  }, []);

  const loadCreditCardSample = useCallback(() => {
    setConfig({
      pattern: "\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b",
      flags: "g",
      testString: "Cartões: 1234-5678-9012-3456, 9876 5432 1098 7654",
      replaceString: "[CARD]"
    });
  }, []);

  const loadHtmlTagSample = useCallback(() => {
    setConfig({
      pattern: "<[^>]+>",
      flags: "g",
      testString: "HTML: <div>conteúdo</div>, <p>texto</p>, <span class='test'>teste</span>",
      replaceString: "[TAG]"
    });
  }, []);

  const loadCamelCaseSample = useCallback(() => {
    setConfig({
      pattern: "\\b[a-z]+(?:[A-Z][a-z]+)*\\b",
      flags: "g",
      testString: "CamelCase: userName, firstName, lastName, emailAddress, phoneNumber",
      replaceString: "[CAMEL]"
    });
  }, []);

  const loadSnakeCaseSample = useCallback(() => {
    setConfig({
      pattern: "\\b[a-z]+(?:_[a-z]+)*\\b",
      flags: "g",
      testString: "snake_case: user_name, first_name, last_name, email_address, phone_number",
      replaceString: "[SNAKE]"
    });
  }, []);

  const loadHexColorSample = useCallback(() => {
    setConfig({
      pattern: "#[0-9A-Fa-f]{6}",
      flags: "g",
      testString: "Cores: #FF0000, #00FF00, #0000FF, #FFFFFF, #123456",
      replaceString: "[COLOR]"
    });
  }, []);

  return {
    config,
    setConfig,
    result,
    errors,
    testRegex,
    clearResult,
    loadSample,
    loadEmailSample,
    loadPhoneSample,
    loadDateSample,
    loadUrlSample,
    loadWordSample,
    loadNumberSample,
    loadCpfSample,
    loadCepSample,
    loadTimeSample,
    loadIpSample,
    loadCreditCardSample,
    loadHtmlTagSample,
    loadCamelCaseSample,
    loadSnakeCaseSample,
    loadHexColorSample
  };
} 