import type { ValidationResult, FormatResult } from './jsonValidationService';

export interface JsonToolsState {
  input: string;
  parsedJson: unknown;
  errors: string[];
  isValid: boolean;
  isFormatted: boolean;
  viewMode: "raw" | "formatted" | "tree";
  searchTerm: string;
  collapsedPaths: Set<string>;
}

export interface JsonStateUpdate {
  input?: string;
  parsedJson?: unknown;
  errors?: string[];
  isValid?: boolean;
  isFormatted?: boolean;
  viewMode?: "raw" | "formatted" | "tree";
  searchTerm?: string;
  collapsedPaths?: Set<string>;
}

export class JsonStateService {
  /**
   * Cria estado inicial
   */
  static createInitialState(): JsonToolsState {
    return {
      input: "",
      parsedJson: null,
      errors: [],
      isValid: false,
      isFormatted: false,
      viewMode: "formatted",
      searchTerm: "",
      collapsedPaths: new Set()
    };
  }

  /**
   * Atualiza estado com validação
   */
  static updateWithValidation(
    currentState: JsonToolsState, 
    validationResult: ValidationResult
  ): JsonToolsState {
    return {
      ...currentState,
      parsedJson: validationResult.parsedJson,
      errors: validationResult.errors,
      isValid: validationResult.isValid,
      isFormatted: false
    };
  }

  /**
   * Atualiza estado com formatação
   */
  static updateWithFormat(
    currentState: JsonToolsState, 
    formatResult: FormatResult
  ): JsonToolsState {
    return {
      ...currentState,
      input: formatResult.formatted,
      isFormatted: formatResult.success,
      errors: formatResult.errors,
      isValid: formatResult.success,
      parsedJson: formatResult.success ? JSON.parse(formatResult.formatted) : currentState.parsedJson
    };
  }

  /**
   * Atualiza estado com minificação
   */
  static updateWithMinify(
    currentState: JsonToolsState, 
    formatResult: FormatResult
  ): JsonToolsState {
    return {
      ...currentState,
      input: formatResult.formatted,
      isFormatted: false,
      errors: formatResult.errors
    };
  }

  /**
   * Atualiza input
   */
  static updateInput(currentState: JsonToolsState, input: string): JsonToolsState {
    return {
      ...currentState,
      input
    };
  }

  /**
   * Atualiza modo de visualização
   */
  static updateViewMode(
    currentState: JsonToolsState, 
    viewMode: "raw" | "formatted" | "tree"
  ): JsonToolsState {
    return {
      ...currentState,
      viewMode
    };
  }

  /**
   * Atualiza termo de busca
   */
  static updateSearchTerm(currentState: JsonToolsState, searchTerm: string): JsonToolsState {
    return {
      ...currentState,
      searchTerm
    };
  }

  /**
   * Alterna colapso de um caminho
   */
  static toggleCollapse(currentState: JsonToolsState, path: string): JsonToolsState {
    const newCollapsedPaths = new Set(currentState.collapsedPaths);
    if (newCollapsedPaths.has(path)) {
      newCollapsedPaths.delete(path);
    } else {
      newCollapsedPaths.add(path);
    }
    
    return {
      ...currentState,
      collapsedPaths: newCollapsedPaths
    };
  }

  /**
   * Colapsa todos os caminhos
   */
  static collapseAll(currentState: JsonToolsState): JsonToolsState {
    const allPaths = this.getAllPaths(currentState.parsedJson);
    return {
      ...currentState,
      collapsedPaths: new Set(allPaths)
    };
  }

  /**
   * Expande todos os caminhos
   */
  static expandAll(currentState: JsonToolsState): JsonToolsState {
    return {
      ...currentState,
      collapsedPaths: new Set()
    };
  }

  /**
   * Limpa o estado
   */
  static clear(): JsonToolsState {
    return this.createInitialState();
  }

  /**
   * Carrega dados de exemplo
   */
  static loadSample(currentState: JsonToolsState): JsonToolsState {
    const sampleJson = JSON.stringify({
      name: "Exemplo JSON",
      version: "1.0.0",
      features: [
        "Validação",
        "Formatação", 
        "Minificação"
      ],
      config: {
        enabled: true,
        timeout: 5000
      }
    }, null, 2);

    return {
      ...currentState,
      input: sampleJson,
      parsedJson: JSON.parse(sampleJson),
      errors: [],
      isValid: true,
      isFormatted: true,
      searchTerm: "",
      collapsedPaths: new Set()
    };
  }

  /**
   * Obtém todos os caminhos de um objeto
   */
  private static getAllPaths(obj: unknown, prefix = ""): string[] {
    if (obj === null || typeof obj !== "object") {
      return [];
    }

    const paths: string[] = [];
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const path = prefix ? `${prefix}[${index}]` : `[${index}]`;
        paths.push(path);
        paths.push(...this.getAllPaths(item, path));
      });
    } else {
      Object.keys(obj as Record<string, unknown>).forEach(key => {
        const path = prefix ? `${prefix}.${key}` : key;
        paths.push(path);
        paths.push(...this.getAllPaths((obj as Record<string, unknown>)[key], path));
      });
    }

    return paths;
  }
} 