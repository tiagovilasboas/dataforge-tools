import { z } from "zod";
import JSON5 from "json5";

// Schema genérico para JSON
const jsonSchema = z.any();

export interface ValidationResult {
  isValid: boolean;
  parsedJson: unknown;
  errors: string[];
}

export interface FormatResult {
  success: boolean;
  formatted: string;
  errors: string[];
}

export class JsonValidationService {
  /**
   * Valida um JSON string e retorna o resultado
   */
  static validate(input: string): ValidationResult {
    if (!input.trim()) {
      return {
        isValid: false,
        parsedJson: null,
        errors: ["Digite um JSON para validar"]
      };
    }

    try {
      const parsed = JSON.parse(input);
      jsonSchema.parse(parsed);
      
      return {
        isValid: true,
        parsedJson: parsed,
        errors: []
      };
    } catch (e) {
      if (e instanceof SyntaxError) {
        return {
          isValid: false,
          parsedJson: null,
          errors: [`Erro de sintaxe: ${e.message}`]
        };
      } else if (e instanceof z.ZodError) {
        return {
          isValid: false,
          parsedJson: null,
          errors: e.errors.map((err) => `${err.path.join(".")} → ${err.message}`)
        };
      } else {
        return {
          isValid: false,
          parsedJson: null,
          errors: ["Erro desconhecido na validação"]
        };
      }
    }
  }

  /**
   * Formata um JSON string
   */
  static format(input: string): FormatResult {
    if (!input.trim()) {
      return {
        success: false,
        formatted: input,
        errors: ["Input vazio"]
      };
    }

    try {
      // Usar JSON5 para parsing mais tolerante
      const parsed = JSON5.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      
      return {
        success: true,
        formatted,
        errors: []
      };
    } catch {
      // Se JSON5 não conseguir, tenta com auto-correção
      try {
        const correctedInput = JsonValidationService.autoCorrect(input);
        const parsed = JSON.parse(correctedInput);
        const formatted = JSON.stringify(parsed, null, 2);
        
        return {
          success: true,
          formatted,
          errors: []
        };
      } catch {
        return {
          success: false,
          formatted: input,
          errors: ["Não foi possível corrigir automaticamente o JSON"]
        };
      }
    }
  }

  /**
   * Minifica um JSON string
   */
  static minify(input: string): FormatResult {
    if (!input.trim()) {
      return {
        success: false,
        formatted: input,
        errors: ["Input vazio"]
      };
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      
      return {
        success: true,
        formatted: minified,
        errors: []
      };
    } catch {
      return {
        success: false,
        formatted: input,
        errors: ["JSON inválido para minificação"]
      };
    }
  }

  /**
   * Auto-correção de JSON com problemas comuns
   */
  private static autoCorrect(input: string): string {
    let corrected = input;
    
    // 1. Remover comentários
    corrected = corrected.replace(/\/\/.*$/gm, '');
    corrected = corrected.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // 2. Corrigir aspas simples para duplas
    corrected = corrected.replace(/'/g, '"');
    
    // 3. Remover vírgulas trailing
    corrected = corrected.replace(/,\s*]/g, ']');
    corrected = corrected.replace(/,\s*}/g, '}');
    
    // 4. Corrigir números com múltiplos pontos decimais
    corrected = corrected.replace(/(\d+)\.(\d+)\.(\d+)/g, '$1.$2$3');
    
    // 5. Corrigir strings não fechadas que terminam com vírgula
    corrected = corrected.replace(/"([^"]*?),(?=\s*[}\]])/g, '"$1",');
    
    // 6. Limpar espaços extras
    corrected = corrected.replace(/\s+,/g, ',');
    
    // 7. Corrigir strings que terminam com quebra de linha
    corrected = corrected.replace(/"([^"]*?)\n/g, '"$1"\n');
    
    return corrected;
  }
} 