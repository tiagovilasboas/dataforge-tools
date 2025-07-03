import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Trash2, 
  Table, 
  Eye, 
  Search, 
  ChevronUp,
  ChevronDown,
  Download,
  Play,
  Grid3X3,
  FileText,
  Settings,
  Upload
} from "lucide-react";
import { useCsvTools } from "./useCsvTools";
import { useTranslation } from "react-i18next";

export function CsvTools() {
  const { state, actions } = useCsvTools();
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    actions.setInput(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      actions.uploadFile(file);
    }
    // Reset input para permitir upload do mesmo arquivo
    e.target.value = '';
  };

  const handleSort = (column: string) => {
    actions.setSortColumn(column);
  };

  const renderSortIcon = (column: string) => {
    if (state.sortColumn !== column) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return state.sortDirection === "asc" 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('csvTools.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('csvTools.subtitle')}
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={actions.loadSample}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t('common.sample')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={actions.clear}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('common.clear')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              {t('csvTools.input.title')}
            </CardTitle>
            <CardDescription>
              {t('csvTools.input.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload Section */}
            <div className="flex items-center gap-2">
              <Input
                id="csv-file-input"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('csv-file-input')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {t('csvTools.input.upload.upload')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('csvTools.input.upload.limits')}
            </p>

            {/* Upload Errors */}
            {state.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {state.errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <Textarea
              value={state.input}
              onChange={handleInputChange}
              placeholder={t('csvTools.input.placeholder')}
              className="min-h-[300px] font-mono text-sm"
            />
            
            {/* Input Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={actions.validate}
                className="flex items-center gap-2"
                disabled={!state.input.trim()}
              >
                <CheckCircle className="w-4 h-4" />
                Validar
              </Button>
              <Button
                variant="outline"
                onClick={actions.copyToClipboard}
                className="flex items-center gap-2"
                disabled={!state.input.trim()}
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>

            {/* Validation Status */}
            {state.input.trim() && (
              <div className="flex items-center gap-2">
                {state.isValid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">CSV válido</span>
                    <Badge variant="secondary" className="text-xs">
                      {state.totalRows} linhas, {state.totalColumns} colunas
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">CSV inválido</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visualização
            </CardTitle>
            <CardDescription>
              Visualize seu CSV de diferentes formas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* View Mode Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {[
                { key: "table", label: "Tabela", icon: Table },
                { key: "raw", label: "Raw", icon: FileText },
                { key: "grid", label: "Grid", icon: Grid3X3 }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={state.viewMode === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => actions.setViewMode(key as "table" | "raw" | "grid")}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Search and Controls */}
            {state.parsedData.length > 0 && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar no CSV..."
                    value={state.searchTerm}
                    onChange={(e) => actions.setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Column Selector */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    Colunas:
                  </span>
                  {state.headers.map((header) => (
                    <Button
                      key={header}
                      variant={state.selectedColumns.has(header) ? "default" : "outline"}
                      size="sm"
                      onClick={() => actions.toggleColumn(header)}
                      className="text-xs"
                    >
                      {header}
                    </Button>
                  ))}
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.exportToCsv}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.exportToJson}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Export JSON
                  </Button>
                </div>
              </div>
            )}

            {/* CSV Display */}
            <div className="min-h-[300px] border rounded-lg p-4 bg-muted/20">
              {!state.parsedData.length ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Valide um CSV para visualizá-lo aqui</p>
                </div>
              ) : state.viewMode === "table" ? (
                <div className="overflow-auto max-h-[300px]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr>
                        {state.headers
                          .filter(header => state.selectedColumns.has(header))
                          .map((header) => (
                            <th 
                              key={header}
                              className="px-3 py-2 text-left font-medium border-b cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort(header)}
                            >
                              <div className="flex items-center gap-1">
                                {header}
                                {renderSortIcon(header)}
                              </div>
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {state.paginatedData.map((row, index) => (
                        <tr key={index} className="hover:bg-muted/30">
                          {state.headers
                            .filter(header => state.selectedColumns.has(header))
                            .map((header) => (
                              <td key={header} className="px-3 py-2 border-b">
                                {row[header] || ""}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : state.viewMode === "raw" ? (
                <pre className="font-mono text-sm overflow-auto max-h-[300px] whitespace-pre-wrap">
                  {state.input}
                </pre>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto max-h-[300px]">
                  {state.paginatedData.map((row, index) => (
                    <Card key={index} className="p-3">
                      {state.headers
                        .filter(header => state.selectedColumns.has(header))
                        .map((header) => (
                          <div key={header} className="mb-2">
                            <div className="text-xs font-medium text-muted-foreground">
                              {header}
                            </div>
                            <div className="text-sm">
                              {row[header] || ""}
                            </div>
                          </div>
                        ))}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {state.parsedData.length > 0 && state.viewMode === "table" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Mostrando {((state.currentPage - 1) * state.rowsPerPage) + 1} a{" "}
                    {Math.min(state.currentPage * state.rowsPerPage, state.filteredData.length)} de{" "}
                    {state.filteredData.length} resultados
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={state.rowsPerPage}
                    onChange={(e) => actions.setRowsPerPage(Number(e.target.value))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={25}>25 por página</option>
                    <option value={50}>50 por página</option>
                  </select>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => actions.setCurrentPage(state.currentPage - 1)}
                      disabled={state.currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      {state.currentPage} de {state.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => actions.setCurrentPage(state.currentPage + 1)}
                      disabled={state.currentPage === state.totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Errors Section */}
      {state.errors.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Erros de Validação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {state.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 