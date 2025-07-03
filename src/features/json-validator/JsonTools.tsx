import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Code, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Trash2, 
  FileText, 
  Eye, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Play
} from "lucide-react";
import { useJsonTools, type JsonToolsState, type JsonToolsActions } from "./useJsonTools";
import { useTranslation } from "react-i18next";

// Configuração dos modos de visualização
const VIEW_MODES = {
  formatted: { label: 'jsonTools.output.formatted', icon: FileText },
  raw: { label: 'jsonTools.output.raw', icon: Code },
  tree: { label: 'jsonTools.output.tree', icon: Eye }
} as const;

// Configuração das ações de entrada
const INPUT_ACTIONS = [
  { key: 'validate', icon: CheckCircle, variant: 'default' as const },
  { key: 'format', icon: FileText, variant: 'outline' as const },
  { key: 'minify', icon: Code, variant: 'outline' as const },
  { key: 'copy', icon: Copy, variant: 'outline' as const }
] as const;

// Tipo para valores JSON
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Componente para o cabeçalho
function JsonToolsHeader({ actions }: { actions: JsonToolsActions }) {
  const { t } = useTranslation();

  const headerActions = [
    { key: 'sample', icon: Play, action: actions.loadSample },
    { key: 'clear', icon: Trash2, action: actions.clear }
  ] as const;

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1" />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('jsonTools.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('jsonTools.subtitle')}
        </p>
      </div>
      <div className="flex-1 flex justify-end">
        <div className="flex gap-2">
          {headerActions.map(({ key, icon: Icon, action }) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={action}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {t(`common.${key}`)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para validação status
function ValidationStatus({ state }: { state: JsonToolsState }) {
  const { t } = useTranslation();

  const hasInput = state.input.trim();
  if (!hasInput) return null;

  const statusConfig = state.isValid 
    ? { icon: CheckCircle, text: t('jsonTools.validation.valid'), className: 'text-green-600' }
    : { icon: XCircle, text: t('jsonTools.validation.invalid'), className: 'text-red-600' };

  const Icon = statusConfig.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${statusConfig.className}`} />
      <span className={`text-sm ${statusConfig.className}`}>{statusConfig.text}</span>
      {state.isFormatted && (
        <Badge variant="secondary" className="text-xs">
          {t('jsonTools.validation.formatted')}
        </Badge>
      )}
    </div>
  );
}

// Componente para ações de entrada
function InputActions({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  const hasInput = state.input.trim();

  const actionHandlers = {
    validate: actions.validate,
    format: actions.format,
    minify: actions.minify,
    copy: actions.copyToClipboard
  };

  return (
    <div className="flex flex-wrap gap-2">
      {INPUT_ACTIONS.map(({ key, icon: Icon, variant }) => (
        <Button
          key={key}
          variant={variant}
          onClick={actionHandlers[key]}
          className="flex items-center gap-2"
          disabled={!hasInput}
        >
          <Icon className="w-4 h-4" />
          {t(`jsonTools.input.${key}`)}
        </Button>
      ))}
    </div>
  );
}

// Componente para a seção de entrada
function JsonInputSection({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    actions.setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    
    e.preventDefault();
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;
    target.value = value.substring(0, start) + "  " + value.substring(end);
    target.selectionStart = target.selectionEnd = start + 2;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          {t('jsonTools.input.title')}
        </CardTitle>
        <CardDescription>{t('jsonTools.input.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={state.input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t('jsonTools.input.placeholder')}
          className="min-h-[300px] font-mono text-sm"
        />
        
        <InputActions state={state} actions={actions} />
        <ValidationStatus state={state} />
      </CardContent>
    </Card>
  );
}

// Componente para os tabs de visualização
function ViewModeTabs({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {Object.entries(VIEW_MODES).map(([key, { label, icon: Icon }]) => (
        <Button
          key={key}
          variant={state.viewMode === key ? "default" : "ghost"}
          size="sm"
          onClick={() => actions.setViewMode(key as keyof typeof VIEW_MODES)}
          className="flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {t(label)}
        </Button>
      ))}
    </div>
  );
}

// Componente para a busca
function JsonSearch({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  if (!state.parsedJson) return null;

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={t('jsonTools.output.search')}
        value={state.searchTerm}
        onChange={(e) => actions.setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}

// Componente para renderizar JSON formatado
function FormattedJson({ data }: { data: unknown }) {
  const jsonString = JSON.stringify(data, null, 2);
  
  return (
    <div className="font-mono text-sm overflow-auto max-h-[300px]">
      <pre className="whitespace-pre-wrap">{jsonString}</pre>
    </div>
  );
}

// Componente para renderizar JSON raw
function RawJson({ data }: { data: unknown }) {
  const jsonString = JSON.stringify(data, null, 2);
  
  return (
    <pre className="font-mono text-sm overflow-auto max-h-[300px] whitespace-pre-wrap">
      {jsonString}
    </pre>
  );
}

// Componente para renderizar o JSON
function JsonDisplay({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  const filteredJson = state.searchTerm && state.parsedJson
    ? filterJsonBySearch(state.parsedJson as JsonValue, state.searchTerm)
    : (state.parsedJson as JsonValue);

  if (!state.parsedJson) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>{t('jsonTools.output.description')}</p>
      </div>
    );
  }

  const viewComponents = {
    formatted: <FormattedJson data={filteredJson} />,
    raw: <RawJson data={filteredJson} />,
    tree: (
      <JsonTreeView 
        data={typeof filteredJson === 'object' && filteredJson !== null ? filteredJson : {}}
        collapsedPaths={state.collapsedPaths}
        onToggleCollapse={actions.toggleCollapse}
      />
    )
  };

  return viewComponents[state.viewMode] || null;
}

// Componente para ações da árvore
function TreeActions({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  if (state.viewMode !== "tree" || !state.parsedJson) return null;

  const treeActions = [
    { key: 'expandAll', icon: ChevronDown, action: actions.expandAll },
    { key: 'collapseAll', icon: ChevronRight, action: actions.collapseAll }
  ] as const;

  return (
    <div className="flex gap-2">
      {treeActions.map(({ key, icon: Icon, action }) => (
        <Button
          key={key}
          variant="outline"
          size="sm"
          onClick={action}
          className="flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {t(`jsonTools.output.${key}`)}
        </Button>
      ))}
    </div>
  );
}

// Componente para a seção de saída
function JsonOutputSection({ state, actions }: { state: JsonToolsState; actions: JsonToolsActions }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          {t('jsonTools.output.title')}
        </CardTitle>
        <CardDescription>{t('jsonTools.output.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ViewModeTabs state={state} actions={actions} />
        <JsonSearch state={state} actions={actions} />
        
        <div className="min-h-[300px] border rounded-lg p-4 bg-muted/20">
          <JsonDisplay state={state} actions={actions} />
        </div>

        <TreeActions state={state} actions={actions} />
      </CardContent>
    </Card>
  );
}

// Componente para erros
function JsonErrors({ state }: { state: JsonToolsState }) {
  const { t } = useTranslation();

  if (state.errors.length === 0) return null;

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {t('jsonTools.validation.errors')}
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
  );
}

// Componente principal
export function JsonTools() {
  const { state, actions } = useJsonTools();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <JsonToolsHeader actions={actions} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <JsonInputSection state={state} actions={actions} />
        <JsonOutputSection state={state} actions={actions} />
      </div>

      <JsonErrors state={state} />
    </div>
  );
}

// Componente para visualização em árvore
interface JsonTreeViewProps {
  data: JsonValue;
  collapsedPaths: Set<string>;
  onToggleCollapse: (path: string) => void;
}

function JsonTreeView({ data, collapsedPaths, onToggleCollapse }: JsonTreeViewProps): React.ReactElement {
  const renderValue = (value: JsonValue): React.ReactNode => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === "boolean") return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === "number") return <span className="text-blue-600">{value}</span>;
    if (typeof value === "string") return <span className="text-green-600">"{value}"</span>;
    return null;
  };

  const renderNode = (key: string, value: JsonValue, path: string, level: number = 0): React.ReactElement => {
    const isCollapsible = typeof value === "object" && value !== null;
    const isCollapsed = collapsedPaths.has(path);

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleCollapse(path);
    };

    return (
      <div key={path} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className="flex items-center gap-1 hover:bg-muted/50 rounded px-1 cursor-pointer"
          onClick={handleToggle}
        >
          {isCollapsible && (
            <button className="p-0.5 hover:bg-muted rounded">
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
          <span className="text-muted-foreground">{key}:</span>
          {!isCollapsible ? (
            renderValue(value)
          ) : (
            <span className="text-muted-foreground">
              {Array.isArray(value) ? "[" : "{"}
              {isCollapsed && "..."}
              {Array.isArray(value) ? "]" : "}"}
            </span>
          )}
        </div>

        {isCollapsible && !isCollapsed && (
          <div>
            {Array.isArray(value) ? (
              value.map((item, index) => renderNode(index.toString(), item, `${path}.${index}`, level + 1))
            ) : (
              Object.entries(value).map(([k, v]) => renderNode(k, v, `${path}.${k}`, level + 1))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTree = (): React.ReactNode => {
    if (typeof data !== "object" || data === null) {
      return renderValue(data);
    }

    return Array.isArray(data) ? (
      data.map((item, index) => renderNode(index.toString(), item, index.toString(), 0))
    ) : (
      Object.entries(data).map(([key, value]) => renderNode(key, value, key, 0))
    );
  };

  return <div className="font-mono text-sm">{renderTree()}</div>;
}

// Atualiza a função de filtro para usar o novo tipo
function filterJsonBySearch(data: JsonValue, searchTerm: string): JsonValue | null {
  const matches = (value: JsonValue): boolean => {
    if (value === null) return false;
    if (typeof value === "object") return false;
    return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filterObject = (obj: Record<string, JsonValue>): Record<string, JsonValue> | null => {
    const result: Record<string, JsonValue> = {};
    let hasMatches = false;

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        const filtered = Array.isArray(value) ? filterArray(value) : filterObject(value as Record<string, JsonValue>);
        if (filtered !== null) {
          result[key] = filtered;
          hasMatches = true;
        }
      } else if (matches(value)) {
        result[key] = value;
        hasMatches = true;
      }
    }

    return hasMatches ? result : null;
  };

  const filterArray = (arr: JsonValue[]): JsonValue[] | null => {
    const filtered = arr
      .map(item => {
        if (typeof item === "object" && item !== null) {
          return Array.isArray(item) ? filterArray(item) : filterObject(item as Record<string, JsonValue>);
        }
        return matches(item) ? item : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return filtered.length > 0 ? filtered : null;
  };

  if (typeof data === "object" && data !== null) {
    return Array.isArray(data) ? filterArray(data) : filterObject(data as Record<string, JsonValue>);
  }

  return matches(data) ? data : null;
} 