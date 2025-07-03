import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { regexConfigSchema, type RegexConfig } from "./schema";
import { regexExamples, getExampleByName } from "./examples";

export interface RegexResult {
  isValid: boolean;
  matches: Array<{
    match: string;
    index: number;
    groups?: string[];
  }>;
  replacement?: string;
  error?: string;
}

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
    try {
      // Valida configuração
      regexConfigSchema.parse(config);
      
      if (!config.pattern.trim()) {
        setResult(null);
        setErrors([]);
        return;
      }

      const regex = new RegExp(config.pattern, config.flags);
      const matches: RegexResult['matches'] = [];
      
      // Encontra matches
      let match;
      while ((match = regex.exec(config.testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        
        // Evita loop infinito se não há flag global
        if (!config.flags.includes('g')) break;
      }

      // Faz substituição se especificado
      let replacement: string | undefined;
      if (config.replaceString && config.testString) {
        replacement = config.testString.replace(regex, config.replaceString);
      }

      setResult({
        isValid: true,
        matches,
        replacement
      });
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

  const loadExample = useCallback((exampleName: string) => {
    const example = getExampleByName(exampleName);
    if (example) {
      setConfig(example.config);
    }
  }, []);

  const loadSample = useCallback(() => {
    loadExample('basic');
  }, [loadExample]);

  const loadEmailSample = useCallback(() => {
    loadExample('email');
  }, [loadExample]);

  const loadPhoneSample = useCallback(() => {
    loadExample('phone');
  }, [loadExample]);

  const loadDateSample = useCallback(() => {
    loadExample('date');
  }, [loadExample]);

  const loadUrlSample = useCallback(() => {
    loadExample('url');
  }, [loadExample]);

  const loadWordSample = useCallback(() => {
    loadExample('basic');
  }, [loadExample]);

  const loadNumberSample = useCallback(() => {
    loadExample('basic');
  }, [loadExample]);

  const loadCpfSample = useCallback(() => {
    loadExample('cpf');
  }, [loadExample]);

  const loadCepSample = useCallback(() => {
    loadExample('cep');
  }, [loadExample]);

  const loadTimeSample = useCallback(() => {
    loadExample('time');
  }, [loadExample]);

  const loadIpSample = useCallback(() => {
    loadExample('ip');
  }, [loadExample]);

  const loadCreditCardSample = useCallback(() => {
    loadExample('creditCard');
  }, [loadExample]);

  const loadHtmlTagSample = useCallback(() => {
    loadExample('htmlTag');
  }, [loadExample]);

  const loadCamelCaseSample = useCallback(() => {
    loadExample('camelCase');
  }, [loadExample]);

  const loadSnakeCaseSample = useCallback(() => {
    loadExample('snakeCase');
  }, [loadExample]);

  const loadHexColorSample = useCallback(() => {
    loadExample('hexColor');
  }, [loadExample]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
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
    loadHexColorSample,
    copyToClipboard,
    examples: regexExamples
  };
} 