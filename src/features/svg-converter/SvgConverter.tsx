import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { 
  Code, 
  Copy, 
  FileCode, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useSvgConverter } from "./useSvgConverter";
import { SvgInputSection } from "./components/SvgInputSection";

// Componente para o cabeçalho da página
function SvgConverterHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1" />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('svgConverter.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('svgConverter.subtitle')}
        </p>
      </div>
      <div className="flex-1" />
    </div>
  );
}

// Componente para configurações básicas
function BasicSettingsSection({
  componentName,
  setComponentName,
  defaultSize,
  setDefaultSize,
  defaultColor,
  setDefaultColor,
  includeProps,
  setIncludeProps,
  includeClassName,
  setIncludeClassName,
  optimizeSvg,
  setOptimizeSvg,
}: {
  componentName: string;
  setComponentName: (value: string) => void;
  defaultSize: number;
  setDefaultSize: (value: number) => void;
  defaultColor: string;
  setDefaultColor: (value: string) => void;
  includeProps: boolean;
  setIncludeProps: (value: boolean) => void;
  includeClassName: boolean;
  setIncludeClassName: (value: boolean) => void;
  optimizeSvg: boolean;
  setOptimizeSvg: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t('svgConverter.settings.title')}
        </CardTitle>
        <CardDescription>
          {t('svgConverter.settings.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="componentName">{t('svgConverter.settings.componentName')}</Label>
            <Input
              id="componentName"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="MyIcon"
            />
          </div>
          <div>
            <Label htmlFor="defaultSize">{t('svgConverter.settings.defaultSize')}</Label>
            <Input
              id="defaultSize"
              type="number"
              value={defaultSize}
              onChange={(e) => setDefaultSize(Number(e.target.value))}
              min="12"
              max="100"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="defaultColor">{t('svgConverter.settings.defaultColor')}</Label>
          <Input
            id="defaultColor"
            value={defaultColor}
            onChange={(e) => setDefaultColor(e.target.value)}
            placeholder="currentColor"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeProps"
              checked={includeProps}
              onCheckedChange={(checked) => setIncludeProps(checked as boolean)}
            />
            <Label htmlFor="includeProps">{t('svgConverter.settings.includeProps')}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeClassName"
              checked={includeClassName}
              onCheckedChange={(checked) => setIncludeClassName(checked as boolean)}
            />
            <Label htmlFor="includeClassName">{t('svgConverter.settings.includeClassName')}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="optimizeSvg"
              checked={optimizeSvg}
              onCheckedChange={(checked) => setOptimizeSvg(checked as boolean)}
            />
            <Label htmlFor="optimizeSvg">{t('svgConverter.settings.optimizeSvg')}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para validação
function ValidationSection({ errors, isValid }: { errors: string[]; isValid: boolean }) {
  const { t } = useTranslation();
  
  if (errors.length === 0 && !isValid) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              {t('svgConverter.validation.valid')}
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-500" />
              {t('svgConverter.validation.invalid')}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para saída
function OutputSection({ reactComponent, copyToClipboard }: { reactComponent: string; copyToClipboard: () => void }) {
  const { t } = useTranslation();
  
  if (!reactComponent) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          {t('svgConverter.output.title')}
        </CardTitle>
        <CardDescription>
          {t('svgConverter.output.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            React Component
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="ml-auto"
          >
            <Copy className="w-4 h-4 mr-1" />
            {t('svgConverter.output.copy')}
          </Button>
        </div>
        
        <div className="relative">
          <Textarea
            value={reactComponent}
            readOnly
            className="min-h-[300px] font-mono text-sm bg-muted/50"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente principal
export function SvgConverter() {
  const { t } = useTranslation();
  const { 
    svgInput, 
    setSvgInput, 
    componentName, 
    setComponentName,
    defaultSize,
    setDefaultSize,
    defaultColor,
    setDefaultColor,
    includeProps,
    setIncludeProps,
    includeClassName,
    setIncludeClassName,
    optimizeSvg,
    setOptimizeSvg,
    errors,
    reactComponent,
    isValid,
    generateReactComponent,
    loadSampleSvg,
    copyToClipboard,
    generateSvgPreview,
  } = useSvgConverter();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SvgConverterHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SvgInputSection
            svgInput={svgInput}
            setSvgInput={setSvgInput}
            loadSampleSvg={loadSampleSvg}
            generateSvgPreview={generateSvgPreview}
          />
          
          <BasicSettingsSection
            componentName={componentName}
            setComponentName={setComponentName}
            defaultSize={defaultSize}
            setDefaultSize={setDefaultSize}
            defaultColor={defaultColor}
            setDefaultColor={setDefaultColor}
            includeProps={includeProps}
            setIncludeProps={setIncludeProps}
            includeClassName={includeClassName}
            setIncludeClassName={setIncludeClassName}
            optimizeSvg={optimizeSvg}
            setOptimizeSvg={setOptimizeSvg}
          />
        </div>
        
        <div className="space-y-6">
          <ValidationSection errors={errors} isValid={isValid} />
          
          <OutputSection 
            reactComponent={reactComponent} 
            copyToClipboard={copyToClipboard} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateReactComponent} 
                className="w-full"
                disabled={!svgInput.trim()}
              >
                {t('svgConverter.actions.generate')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 