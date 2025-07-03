import { useState, useCallback } from "react";
import Papa from "papaparse";
import { csvSchema } from "./schema";

export interface CsvRow {
  [key: string]: string;
}

export interface CsvToolsState {
  input: string;
  parsedData: CsvRow[];
  headers: string[];
  errors: string[];
  isValid: boolean;
  totalRows: number;
  totalColumns: number;
  viewMode: "table" | "raw" | "grid";
  searchTerm: string;
  selectedColumns: Set<string>;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  currentPage: number;
  rowsPerPage: number;
  filteredData: CsvRow[];
}

export interface CsvToolsActions {
  setInput: (input: string) => void;
  validate: () => void;
  setViewMode: (mode: "table" | "raw" | "grid") => void;
  setSearchTerm: (term: string) => void;
  toggleColumn: (column: string) => void;
  setSortColumn: (column: string | null) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  copyToClipboard: () => void;
  clear: () => void;
  loadSample: () => void;
  uploadFile: (file: File) => void;
  exportToCsv: () => void;
  exportToJson: () => void;
}

export function useCsvTools() {
  const [state, setState] = useState<CsvToolsState>({
    input: "",
    parsedData: [],
    headers: [],
    errors: [],
    isValid: false,
    totalRows: 0,
    totalColumns: 0,
    viewMode: "table",
    searchTerm: "",
    selectedColumns: new Set(),
    sortColumn: null,
    sortDirection: "asc",
    currentPage: 1,
    rowsPerPage: 10,
    filteredData: []
  });

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }));
  }, []);

  const validate = useCallback(() => {
    if (!state.input.trim()) {
      setState(prev => ({
        ...prev,
        errors: ["Digite um CSV para validar"],
        isValid: false,
        parsedData: [],
        headers: [],
        totalRows: 0,
        totalColumns: 0,
        filteredData: []
      }));
      return;
    }

    try {
      const result = Papa.parse(state.input, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => value.trim()
      });

      if (result.errors.length > 0) {
        setState(prev => ({
          ...prev,
          errors: result.errors.map((err) => 
            `Linha ${(err.row || 0) + 1}: ${err.message}`
          ),
          isValid: false,
          parsedData: [],
          headers: [],
          totalRows: 0,
          totalColumns: 0,
          filteredData: []
        }));
        return;
      }

      // FILTRO: remove linhas totalmente vazias ou com todos os campos undefined
      let data = result.data as CsvRow[];
      // Corrige: transforma undefined em "" para todos os campos
      data = data.map(row =>
        Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, v === undefined ? "" : v])
        )
      );
      // Remove linhas totalmente vazias
      data = data.filter(row =>
        Object.values(row).some(value => value !== "")
      );
      const headers = result.meta.fields || [];
      
      // Validar com schema se houver dados
      if (data.length > 0) {
        try {
          // Validar cada linha individualmente
          data.forEach((row) => {
            csvSchema.parse(row);
          });
        } catch {
          setState(prev => ({
            ...prev,
            errors: ["Erro de validação do schema"],
            isValid: false,
            parsedData: data,
            headers,
            totalRows: data.length,
            totalColumns: headers.length,
            filteredData: data
          }));
          return;
        }
      }

      setState(prev => ({
        ...prev,
        parsedData: data,
        headers,
        errors: [],
        isValid: true,
        totalRows: data.length,
        totalColumns: headers.length,
        filteredData: data,
        selectedColumns: new Set(headers)
      }));
    } catch {
      setState(prev => ({
        ...prev,
        errors: ["Erro ao processar CSV"],
        isValid: false,
        parsedData: [],
        headers: [],
        totalRows: 0,
        totalColumns: 0,
        filteredData: []
      }));
    }
  }, [state.input]);

  const setViewMode = useCallback((mode: "table" | "raw" | "grid") => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setState(prev => {
      const filtered = term.trim() 
        ? prev.parsedData.filter(row => 
            Object.values(row).some(value => 
              value.toLowerCase().includes(term.toLowerCase())
            )
          )
        : prev.parsedData;
      
      return { 
        ...prev, 
        searchTerm: term,
        filteredData: filtered,
        currentPage: 1
      };
    });
  }, []);

  const toggleColumn = useCallback((column: string) => {
    setState(prev => {
      const newSelectedColumns = new Set(prev.selectedColumns);
      if (newSelectedColumns.has(column)) {
        newSelectedColumns.delete(column);
      } else {
        newSelectedColumns.add(column);
      }
      return { ...prev, selectedColumns: newSelectedColumns };
    });
  }, []);

  const setSortColumn = useCallback((column: string | null) => {
    setState(prev => {
      if (prev.sortColumn === column) {
        return { 
          ...prev, 
          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc" 
        };
      }
      return { 
        ...prev, 
        sortColumn: column, 
        sortDirection: "asc" 
      };
    });
  }, []);

  const setSortDirection = useCallback((direction: "asc" | "desc") => {
    setState(prev => ({ ...prev, sortDirection: direction }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setRowsPerPage = useCallback((rows: number) => {
    setState(prev => ({ 
      ...prev, 
      rowsPerPage: rows,
      currentPage: 1
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
      parsedData: [],
      headers: [],
      errors: [],
      isValid: false,
      totalRows: 0,
      totalColumns: 0,
      viewMode: "table",
      searchTerm: "",
      selectedColumns: new Set(),
      sortColumn: null,
      sortDirection: "asc",
      currentPage: 1,
      rowsPerPage: 10,
      filteredData: []
    });
  }, []);

  const loadSample = useCallback(() => {
    const sampleCsv = `name,email,age,city,active
João Silva,joao@email.com,28,São Paulo,true
Maria Santos,maria@email.com,32,Rio de Janeiro,true
Pedro Costa,pedro@email.com,25,Belo Horizonte,false
Ana Oliveira,ana@email.com,29,Salvador,true
Carlos Ferreira,carlos@email.com,35,Recife,false
Lúcia Mendes,lucia@email.com,31,Fortaleza,true
Roberto Lima,roberto@email.com,27,Curitiba,false
Fernanda Costa,fernanda@email.com,33,Porto Alegre,true
Marcos Silva,marcos@email.com,26,Brasília,true
Juliana Santos,juliana@email.com,30,Manaus,false`;

    // Validar diretamente com o novo conteúdo
    try {
      const result = Papa.parse(sampleCsv, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => value.trim()
      });

      if (result.errors.length > 0) {
        setState(prev => ({
          ...prev,
          input: sampleCsv,
          errors: result.errors.map((err) => 
            `Linha ${(err.row || 0) + 1}: ${err.message}`
          ),
          isValid: false,
          parsedData: [],
          headers: [],
          totalRows: 0,
          totalColumns: 0,
          filteredData: []
        }));
        return;
      }

      // FILTRO: remove linhas totalmente vazias ou com todos os campos undefined
      let data = result.data as CsvRow[];
      // Corrige: transforma undefined em "" para todos os campos
      data = data.map(row =>
        Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, v === undefined ? "" : v])
        )
      );
      // Remove linhas totalmente vazias
      data = data.filter(row =>
        Object.values(row).some(value => value !== "")
      );
      const headers = result.meta.fields || [];
      
      // Validar com schema se houver dados
      if (data.length > 0) {
        try {
          // Validar cada linha individualmente
          data.forEach((row) => {
            csvSchema.parse(row);
          });
        } catch {
          setState(prev => ({
            ...prev,
            input: sampleCsv,
            errors: ["Erro de validação do schema"],
            isValid: false,
            parsedData: data,
            headers,
            totalRows: data.length,
            totalColumns: headers.length,
            filteredData: data
          }));
          return;
        }
      }

      setState(prev => ({
        ...prev,
        input: sampleCsv,
        parsedData: data,
        headers,
        errors: [],
        isValid: true,
        totalRows: data.length,
        totalColumns: headers.length,
        filteredData: data,
        selectedColumns: new Set(headers)
      }));
    } catch {
      setState(prev => ({
        ...prev,
        input: sampleCsv,
        errors: ["Erro ao processar CSV"],
        isValid: false,
        parsedData: [],
        headers: [],
        totalRows: 0,
        totalColumns: 0,
        filteredData: []
      }));
    }
  }, []);

  const uploadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Validar diretamente com o novo conteúdo
      try {
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transform: (value) => value.trim()
        });

        if (result.errors.length > 0) {
          setState(prev => ({
            ...prev,
            input: text,
            errors: result.errors.map((err) => 
              `Linha ${(err.row || 0) + 1}: ${err.message}`
            ),
            isValid: false,
            parsedData: [],
            headers: [],
            totalRows: 0,
            totalColumns: 0,
            filteredData: []
          }));
          return;
        }

        // FILTRO: remove linhas totalmente vazias ou com todos os campos undefined
        let data = result.data as CsvRow[];
        // Corrige: transforma undefined em "" para todos os campos
        data = data.map(row =>
          Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k, v === undefined ? "" : v])
          )
        );
        // Remove linhas totalmente vazias
        data = data.filter(row =>
          Object.values(row).some(value => value !== "")
        );
        const headers = result.meta.fields || [];
        
        // Validar com schema se houver dados
        if (data.length > 0) {
          try {
            // Validar cada linha individualmente
            data.forEach((row) => {
              csvSchema.parse(row);
            });
          } catch {
            setState(prev => ({
              ...prev,
              input: text,
              errors: ["Erro de validação do schema"],
              isValid: false,
              parsedData: data,
              headers,
              totalRows: data.length,
              totalColumns: headers.length,
              filteredData: data
            }));
            return;
          }
        }

        setState(prev => ({
          ...prev,
          input: text,
          parsedData: data,
          headers,
          errors: [],
          isValid: true,
          totalRows: data.length,
          totalColumns: headers.length,
          filteredData: data,
          selectedColumns: new Set(headers)
        }));
      } catch {
        setState(prev => ({
          ...prev,
          input: text,
          errors: ["Erro ao processar CSV"],
          isValid: false,
          parsedData: [],
          headers: [],
          totalRows: 0,
          totalColumns: 0,
          filteredData: []
        }));
      }
    };
    reader.readAsText(file);
  }, []);

  const exportToCsv = useCallback(() => {
    if (!state.parsedData.length) return;
    
    const csv = Papa.unparse(state.parsedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.parsedData]);

  const exportToJson = useCallback(() => {
    if (!state.parsedData.length) return;
    
    const json = JSON.stringify(state.parsedData, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.json");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.parsedData]);

  // Computed values
  const sortedData = useCallback(() => {
    if (!state.sortColumn) return state.filteredData;
    
    return [...state.filteredData].sort((a, b) => {
      const aVal = a[state.sortColumn!] || "";
      const bVal = b[state.sortColumn!] || "";
      
      if (state.sortDirection === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [state.filteredData, state.sortColumn, state.sortDirection]);

  const paginatedData = useCallback(() => {
    const sorted = sortedData();
    const start = (state.currentPage - 1) * state.rowsPerPage;
    const end = start + state.rowsPerPage;
    return sorted.slice(start, end);
  }, [sortedData, state.currentPage, state.rowsPerPage]);

  const totalPages = Math.ceil(state.filteredData.length / state.rowsPerPage);

  return {
    state: {
      ...state,
      sortedData: sortedData(),
      paginatedData: paginatedData(),
      totalPages
    },
    actions: {
      setInput,
      validate,
      setViewMode,
      setSearchTerm,
      toggleColumn,
      setSortColumn,
      setSortDirection,
      setCurrentPage,
      setRowsPerPage,
      copyToClipboard,
      clear,
      loadSample,
      uploadFile,
      exportToCsv,
      exportToJson
    }
  };
} 