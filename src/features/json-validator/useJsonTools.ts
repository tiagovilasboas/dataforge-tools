import { useState, useCallback } from "react";
import { JsonValidationService } from "./services/jsonValidationService";
import { JsonStateService, type JsonToolsState } from "./services/jsonStateService";
import { JsonUtilsService } from "./services/jsonUtilsService";

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
  const [state, setState] = useState<JsonToolsState>(JsonStateService.createInitialState());

  // Ações de input
  const setInput = useCallback((input: string) => {
    setState(prev => JsonStateService.updateInput(prev, input));
  }, []);

  // Ações de validação
  const validate = useCallback(() => {
    const validationResult = JsonValidationService.validate(state.input);
    setState(prev => JsonStateService.updateWithValidation(prev, validationResult));
  }, [state.input]);

  // Ações de formatação
  const format = useCallback(() => {
    const formatResult = JsonValidationService.format(state.input);
    setState(prev => JsonStateService.updateWithFormat(prev, formatResult));
  }, [state.input]);

  const minify = useCallback(() => {
    const minifyResult = JsonValidationService.minify(state.input);
    setState(prev => JsonStateService.updateWithMinify(prev, minifyResult));
  }, [state.input]);

  // Ações de visualização
  const setViewMode = useCallback((mode: "raw" | "formatted" | "tree") => {
    setState(prev => JsonStateService.updateViewMode(prev, mode));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setState(prev => JsonStateService.updateSearchTerm(prev, term));
  }, []);

  // Ações de colapso
  const toggleCollapse = useCallback((path: string) => {
    setState(prev => JsonStateService.toggleCollapse(prev, path));
  }, []);

  const collapseAll = useCallback(() => {
    setState(prev => JsonStateService.collapseAll(prev));
  }, []);

  const expandAll = useCallback(() => {
    setState(prev => JsonStateService.expandAll(prev));
  }, []);

  // Ações de utilitários
  const copyToClipboard = useCallback(async () => {
    const success = await JsonUtilsService.copyToClipboard(state.input);
    if (success) {
      // Aqui poderia mostrar uma notificação de sucesso
      console.log('Copiado para clipboard');
    }
  }, [state.input]);

  const clear = useCallback(() => {
    setState(JsonStateService.clear());
  }, []);

  const loadSample = useCallback(() => {
    setState(prev => JsonStateService.loadSample(prev));
  }, []);

  // Dados filtrados por busca
  const filteredJson = JsonUtilsService.filterJsonBySearch(state.parsedJson, state.searchTerm);

  // Estatísticas do JSON
  const jsonStats = state.parsedJson ? JsonUtilsService.getJsonStats(state.parsedJson) : null;

  return {
    state: {
      ...state,
      filteredJson,
      jsonStats
    },
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