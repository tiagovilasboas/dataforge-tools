import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Plus, 
  Trash2, 
  Play, 
  Download, 
  Code, 
  Copy,
  Settings
} from "lucide-react";
import { useMockGenerator } from "./useMockGenerator";

function MockConfig({ 
  config, 
  setConfig, 
  addField, 
  removeField, 
  updateField, 
  loadSample,
  dataTypes 
}: ReturnType<typeof useMockGenerator>) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('mockGenerator.config.title')}
        </CardTitle>
        <CardDescription>
          {t('mockGenerator.config.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurações gerais */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="count" className="text-sm font-medium">{t('mockGenerator.config.count')}</label>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={config.count}
              onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
            />
          </div>
          <div>
            <label htmlFor="format" className="text-sm font-medium">{t('mockGenerator.config.format')}</label>
            <select
              id="format"
              value={config.format}
              onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as "json" | "csv" }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <Separator />

        {/* Campos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium">{t('mockGenerator.config.fields')}</label>
            <Button onClick={addField} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('mockGenerator.actions.addField')}
            </Button>
          </div>

          <div className="space-y-4">
            {config.fields.map((field, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-end p-4 border rounded-md">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    placeholder="nome_do_campo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value as keyof typeof dataTypes })}
                    className="w-full p-2 border rounded-md"
                  >
                    {Object.entries(dataTypes).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${index}`}
                    checked={field.required}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                  />
                  <label htmlFor={`required-${index}`} className="text-sm">Obrigatório</label>
                </div>
                <Button
                  onClick={() => removeField(index)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={loadSample} variant="outline" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {t('mockGenerator.actions.loadSample')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MockOutput({ 
  result, 
  errors 
}: Pick<ReturnType<typeof useMockGenerator>, 'result' | 'errors'>) {
  const { t } = useTranslation();

  if (errors.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Database className="h-5 w-5" />
            {t('mockGenerator.output.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('mockGenerator.output.title')}
          </CardTitle>
          <CardDescription>
            {t('mockGenerator.output.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('mockGenerator.output.empty')}
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = () => {
    const output = result.format === 'json' 
      ? JSON.stringify(result.data, null, 2)
      : result.data.map(row => Object.values(row).join(',')).join('\n');
    navigator.clipboard.writeText(output);
  };

  const downloadData = () => {
    const output = result.format === 'json' 
      ? JSON.stringify(result.data, null, 2)
      : result.data.map(row => Object.values(row).join(',')).join('\n');
    
    const blob = new Blob([output], { type: result.format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data.${result.format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {t('mockGenerator.output.title')}
        </CardTitle>
        <CardDescription>
          {t('mockGenerator.output.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default">
              {result.count} {t('mockGenerator.output.records')}
            </Badge>
            <Badge variant="outline">
              {result.format.toUpperCase()}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              {t('mockGenerator.actions.copy')}
            </Button>
            <Button onClick={downloadData} variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('mockGenerator.actions.download')}
            </Button>
          </div>
        </div>

        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto max-h-96">
          <code>
            {result.format === 'json' 
              ? JSON.stringify(result.data, null, 2)
              : result.data.map(row => Object.values(row).join(',')).join('\n')
            }
          </code>
        </pre>
      </CardContent>
    </Card>
  );
}

export function MockGenerator() {
  const { t } = useTranslation();
  const mockGenerator = useMockGenerator();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('mockGenerator.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('mockGenerator.subtitle')}
          </p>
        </div>
        <div className="flex-1" />
      </div>

      <div className="grid gap-6">
        <MockConfig {...mockGenerator} />
        
        <div className="flex justify-center">
          <Button onClick={mockGenerator.generateMock} size="lg" className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {t('mockGenerator.actions.generate')}
          </Button>
        </div>

        <MockOutput {...mockGenerator} />
      </div>
    </div>
  );
} 