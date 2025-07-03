import { useState, useCallback } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import JSON5 from "json5";

// Schema genérico para JSON
const jsonSchema = z.any();

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

export interface JsonToolsActions {
  setInput: (input: string) => void;
  validate: () => void;
  format: () => void;
  minify: () => void;
  setViewMode: (mode: "raw" | "formatted" | "tree") => void;
  setSearchTerm: (term: string) => void;
  toggleCollapse: (path: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  copyToClipboard: () => void;
  clear: () => void;
  loadSample: () => void;
}

export function useJsonTools() {
  const { t } = useTranslation();
  const [state, setState] = useState<JsonToolsState>({
    input: "",
    parsedJson: null,
    errors: [],
    isValid: false,
    isFormatted: false,
    viewMode: "formatted",
    searchTerm: "",
    collapsedPaths: new Set()
  });

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }));
  }, []);

  const validate = useCallback(() => {
    if (!state.input.trim()) {
      setState(prev => ({
        ...prev,
        errors: ["Digite um JSON para validar"],
        isValid: false,
        parsedJson: null
      }));
      return;
    }

    try {
      const parsed = JSON.parse(state.input);
      jsonSchema.parse(parsed);
      
      setState(prev => ({
        ...prev,
        parsedJson: parsed,
        errors: [],
        isValid: true,
        isFormatted: false
      }));
    } catch (e) {
      if (e instanceof SyntaxError) {
        setState(prev => ({
          ...prev,
          errors: [`Erro de sintaxe: ${e.message}`],
          isValid: false,
          parsedJson: null
        }));
      } else if (e instanceof z.ZodError) {
        setState(prev => ({
          ...prev,
          errors: e.errors.map((err) => `${err.path.join(".")} → ${err.message}`),
          isValid: false,
          parsedJson: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          errors: ["Erro desconhecido na validação"],
          isValid: false,
          parsedJson: null
        }));
      }
    }
  }, [state.input]);

  const format = useCallback(() => {
    if (!state.input.trim()) return;

    try {
      // Usar JSON5 para parsing mais tolerante
      const parsed = JSON5.parse(state.input);
      const formatted = JSON.stringify(parsed, null, 2);
      
      setState(prev => ({
        ...prev,
        input: formatted,
        isFormatted: true,
        parsedJson: parsed,
        errors: [],
        isValid: true
      }));
    } catch {
      // Se JSON5 não conseguir, tenta com a função de auto-correção manual
      try {
        const correctedInput = autoCorrectJson(state.input);
        const parsed = JSON.parse(correctedInput);
        const formatted = JSON.stringify(parsed, null, 2);
        
        setState(prev => ({
          ...prev,
          input: formatted,
          isFormatted: true,
          parsedJson: parsed,
          errors: [],
          isValid: true
        }));
      } catch {
        // Se não conseguir corrigir, mantém o input original
        setState(prev => ({
          ...prev,
          errors: [t('jsonTools.validation.autoCorrectFailed')],
          isValid: false
        }));
      }
    }
  }, [state.input, t]);

  // Função de auto-correção manual como fallback
  const autoCorrectJson = (input: string): string => {
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
  };

  const minify = useCallback(() => {
    if (!state.input.trim()) return;

    try {
      const parsed = JSON.parse(state.input);
      const minified = JSON.stringify(parsed);
      
      setState(prev => ({
        ...prev,
        input: minified,
        isFormatted: false
      }));
    } catch {
      // Se não conseguir minificar, mantém o input original
    }
  }, [state.input]);

  const setViewMode = useCallback((mode: "raw" | "formatted" | "tree") => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const toggleCollapse = useCallback((path: string) => {
    setState(prev => {
      const newCollapsedPaths = new Set(prev.collapsedPaths);
      if (newCollapsedPaths.has(path)) {
        newCollapsedPaths.delete(path);
      } else {
        newCollapsedPaths.add(path);
      }
      return { ...prev, collapsedPaths: newCollapsedPaths };
    });
  }, []);

  const collapseAll = useCallback(() => {
    if (!state.parsedJson) return;
    
    const paths = getAllPaths(state.parsedJson);
    setState(prev => ({
      ...prev,
      collapsedPaths: new Set(paths)
    }));
  }, [state.parsedJson]);

  const expandAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      collapsedPaths: new Set()
    }));
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!state.input.trim()) return;
    
    try {
      await navigator.clipboard.writeText(state.input);
    } catch {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea");
      textArea.value = state.input;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  }, [state.input]);

  const clear = useCallback(() => {
    setState({
      input: "",
      parsedJson: null,
      errors: [],
      isValid: false,
      isFormatted: false,
      viewMode: "formatted",
      searchTerm: "",
      collapsedPaths: new Set()
    });
  }, []);

  const loadSample = useCallback(() => {
    // JSON correto para demonstrar formatação
    const correctJson = `{
  "app": {
    "name": "DataForge Tools",
    "version": "1.0.0",
    "description": "Suite completa de ferramentas para desenvolvedores",
    "features": [
      "JSON Validator",
      "CSV Validator", 
      "JWT Decoder",
      "Regex Tester",
      "Mock Generator"
    ],
    "config": {
      "autoSave": true,
      "notifications": {
        "enabled": true,
        "sound": false
      }
    },
    "metadata": {
      "created": "2024-01-15",
      "author": "Tiago Vilas Boas",
      "tags": ["tools", "developer", "validation", "json", "csv"],
      "repository": "https://github.com/tiagovilasboas/dataforge-tools",
      "license": "MIT"
    },
    "stats": {
      "users": 1000,
      "downloads": 5000,
      "stars": 150
    }
  }
}`;

    setState(prev => ({
      ...prev,
      input: correctJson,
      parsedJson: null,
      errors: [],
      isValid: false,
      isFormatted: false,
      searchTerm: "",
      collapsedPaths: new Set()
    }));
  }, []);

  return {
    state,
    actions: {
      setInput,
      validate,
      format,
      minify,
      setViewMode,
      setSearchTerm,
      toggleCollapse,
      collapseAll,
      expandAll,
      copyToClipboard,
      clear,
      loadSample
    }
  };
}

// Função auxiliar para obter todos os caminhos de um objeto
function getAllPaths(obj: unknown, prefix = ""): string[] {
  const paths: string[] = [];
  
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const key in obj) {
      const path = prefix ? `${prefix}.${key}` : key;
      paths.push(path);
      
      const value = (obj as Record<string, unknown>)[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        paths.push(...getAllPaths(value, path));
      }
    }
  }
  
  return paths;
} 