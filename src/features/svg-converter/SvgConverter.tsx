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
  Image, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useSvgConverter } from "./useSvgConverter";

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

// Componente para entrada SVG
function SvgInputSection({ 
  svgInput, 
  setSvgInput, 
  loadSampleSvg,
  generateSvgPreview
}: {
  svgInput: string;
  setSvgInput: (value: string) => void;
  loadSampleSvg: () => void;
  generateSvgPreview: (svg: string, size?: number, color?: string) => string;
}) {
  const { t } = useTranslation();
  const [previewSize, setPreviewSize] = React.useState(100);
  const [previewColor, setPreviewColor] = React.useState("#3b82f6");
  
  const previewSvg = generateSvgPreview(svgInput, previewSize, previewColor);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          {t('svgConverter.input.title')}
        </CardTitle>
        <CardDescription>
          {t('svgConverter.input.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="svg-input">{t('svgConverter.input.svgCode')}</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSampleSvg}
              className="text-xs"
            >
              <FileCode className="w-3 h-3 mr-1" />
              {t('svgConverter.input.loadSample')}
            </Button>
          </div>
          <Textarea
            id="svg-input"
            placeholder={t('svgConverter.input.placeholder')}
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Preview Section */}
        {previewSvg && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={previewSize}
                  onChange={(e) => setPreviewSize(Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                  min="16"
                  max="200"
                />
                <Input
                  type="color"
                  value={previewColor}
                  onChange={(e) => setPreviewColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded border">
              <div 
                dangerouslySetInnerHTML={{ __html: previewSvg }}
                className="flex items-center justify-center"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
          <div className="space-y-2">
            <Label htmlFor="component-name">{t('svgConverter.settings.componentName')}</Label>
            <Input
              id="component-name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="MyIcon"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-size">{t('svgConverter.settings.defaultSize')}</Label>
            <Input
              id="default-size"
              type="number"
              value={defaultSize}
              onChange={(e) => setDefaultSize(Number(e.target.value))}
              min="1"
              max="1000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default-color">{t('svgConverter.settings.defaultColor')}</Label>
          <Input
            id="default-color"
            value={defaultColor}
            onChange={(e) => setDefaultColor(e.target.value)}
            placeholder="currentColor"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-props"
              checked={includeProps}
              onCheckedChange={(checked) => setIncludeProps(checked as boolean)}
            />
            <Label htmlFor="include-props">{t('svgConverter.settings.includeProps')}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-classname"
              checked={includeClassName}
              onCheckedChange={(checked) => setIncludeClassName(checked as boolean)}
            />
            <Label htmlFor="include-classname">{t('svgConverter.settings.includeClassName')}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="optimize-svg"
              checked={optimizeSvg}
              onCheckedChange={(checked) => setOptimizeSvg(checked as boolean)}
            />
            <Label htmlFor="optimize-svg">{t('svgConverter.settings.optimizeSvg')}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para configurações avançadas
function AdvancedSettingsSection({
  useTypeScript,
  setUseTypeScript,
  useNamedExport,
  setUseNamedExport,
  removeViewBox,
  setRemoveViewBox,
  removeDimensions,
  setRemoveDimensions,
  removeFill,
  setRemoveFill,
  removeStroke,
  setRemoveStroke,
  useMemo,
  setUseMemo,
  useForwardRef,
  setUseForwardRef,
  prettier,
  setPrettier,
}: {
  useTypeScript: boolean;
  setUseTypeScript: (value: boolean) => void;
  useNamedExport: boolean;
  setUseNamedExport: (value: boolean) => void;
  removeViewBox: boolean;
  setRemoveViewBox: (value: boolean) => void;
  removeDimensions: boolean;
  setRemoveDimensions: (value: boolean) => void;
  removeFill: boolean;
  setRemoveFill: (value: boolean) => void;
  removeStroke: boolean;
  setRemoveStroke: (value: boolean) => void;
  useMemo: boolean;
  setUseMemo: (value: boolean) => void;
  useForwardRef: boolean;
  setUseForwardRef: (value: boolean) => void;
  prettier: boolean;
  setPrettier: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <Card>
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 w-full text-left hover:bg-muted/50 p-2 rounded-md transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          <CardTitle className="text-lg">
            {t('svgConverter.settings.advanced.title')}
          </CardTitle>
        </button>
        <CardDescription>
          Configurações avançadas para personalizar a geração do componente
        </CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-typescript"
                  checked={useTypeScript}
                  onCheckedChange={(checked) => setUseTypeScript(checked as boolean)}
                />
                <Label htmlFor="use-typescript">{t('svgConverter.settings.advanced.useTypeScript')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-named-export"
                  checked={useNamedExport}
                  onCheckedChange={(checked) => setUseNamedExport(checked as boolean)}
                />
                <Label htmlFor="use-named-export">{t('svgConverter.settings.advanced.useNamedExport')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-memo"
                  checked={useMemo}
                  onCheckedChange={(checked) => setUseMemo(checked as boolean)}
                />
                <Label htmlFor="use-memo">{t('svgConverter.settings.advanced.useMemo')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-forward-ref"
                  checked={useForwardRef}
                  onCheckedChange={(checked) => setUseForwardRef(checked as boolean)}
                />
                <Label htmlFor="use-forward-ref">{t('svgConverter.settings.advanced.useForwardRef')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prettier"
                  checked={prettier}
                  onCheckedChange={(checked) => setPrettier(checked as boolean)}
                />
                <Label htmlFor="prettier">Formatar código</Label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remove-viewbox"
                  checked={removeViewBox}
                  onCheckedChange={(checked) => setRemoveViewBox(checked as boolean)}
                />
                <Label htmlFor="remove-viewbox">{t('svgConverter.settings.advanced.removeViewBox')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remove-dimensions"
                  checked={removeDimensions}
                  onCheckedChange={(checked) => setRemoveDimensions(checked as boolean)}
                />
                <Label htmlFor="remove-dimensions">{t('svgConverter.settings.advanced.removeDimensions')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remove-fill"
                  checked={removeFill}
                  onCheckedChange={(checked) => setRemoveFill(checked as boolean)}
                />
                <Label htmlFor="remove-fill">{t('svgConverter.settings.advanced.removeFill')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remove-stroke"
                  checked={removeStroke}
                  onCheckedChange={(checked) => setRemoveStroke(checked as boolean)}
                />
                <Label htmlFor="remove-stroke">{t('svgConverter.settings.advanced.removeStroke')}</Label>
              </div>
            </div>
          </div>
        </CardContent>
      )}
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

// Componente para estatísticas SVG
function SvgStatsSection({ 
  svgInput, 
  getSvgStats 
}: {
  svgInput: string;
  getSvgStats: (svg: string) => {
    originalSize: number;
    optimizedSize: number;
    sizeReduction: string;
    totalElements: number;
    elements: {
      paths: number;
      circles: number;
      rectangles: number;
      lines: number;
      polygons: number;
      polylines: number;
      ellipses: number;
    };
    viewBox: string;
  } | null;
}) {
  const stats = getSvgStats(svgInput);
  
  if (!stats) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileCode className="w-5 h-5" />
          Estatísticas do SVG
        </CardTitle>
        <CardDescription>
          Informações sobre otimização e estrutura do SVG
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tamanho</Label>
            <div className="text-sm space-y-1">
              <div>Original: {stats.originalSize} chars</div>
              <div>Otimizado: {stats.optimizedSize} chars</div>
              <div className="text-green-600 font-medium">
                Redução: {stats.sizeReduction}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Elementos</Label>
            <div className="text-sm space-y-1">
              <div>Total: {stats.totalElements}</div>
              <div>ViewBox: {stats.viewBox}</div>
            </div>
          </div>
        </div>

        {stats.totalElements > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Detalhamento</Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {stats.elements.paths > 0 && (
                <div className="flex justify-between">
                  <span>Paths:</span>
                  <span className="font-medium">{stats.elements.paths}</span>
                </div>
              )}
              {stats.elements.circles > 0 && (
                <div className="flex justify-between">
                  <span>Circles:</span>
                  <span className="font-medium">{stats.elements.circles}</span>
                </div>
              )}
              {stats.elements.rectangles > 0 && (
                <div className="flex justify-between">
                  <span>Rectangles:</span>
                  <span className="font-medium">{stats.elements.rectangles}</span>
                </div>
              )}
              {stats.elements.lines > 0 && (
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span className="font-medium">{stats.elements.lines}</span>
                </div>
              )}
              {stats.elements.polygons > 0 && (
                <div className="flex justify-between">
                  <span>Polygons:</span>
                  <span className="font-medium">{stats.elements.polygons}</span>
                </div>
              )}
              {stats.elements.polylines > 0 && (
                <div className="flex justify-between">
                  <span>Polylines:</span>
                  <span className="font-medium">{stats.elements.polylines}</span>
                </div>
              )}
              {stats.elements.ellipses > 0 && (
                <div className="flex justify-between">
                  <span>Ellipses:</span>
                  <span className="font-medium">{stats.elements.ellipses}</span>
                </div>
              )}
            </div>
          </div>
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
    useTypeScript,
    setUseTypeScript,
    useNamedExport,
    setUseNamedExport,
    removeViewBox,
    setRemoveViewBox,
    removeDimensions,
    setRemoveDimensions,
    removeFill,
    setRemoveFill,
    removeStroke,
    setRemoveStroke,
    useMemo,
    setUseMemo,
    useForwardRef,
    setUseForwardRef,
    prettier,
    setPrettier,
    errors,
    reactComponent,
    isValid,
    generateReactComponent,
    loadSampleSvg,
    copyToClipboard,
    generateSvgPreview,
    getSvgStats,
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

          <AdvancedSettingsSection
            useTypeScript={useTypeScript}
            setUseTypeScript={setUseTypeScript}
            useNamedExport={useNamedExport}
            setUseNamedExport={setUseNamedExport}
            removeViewBox={removeViewBox}
            setRemoveViewBox={setRemoveViewBox}
            removeDimensions={removeDimensions}
            setRemoveDimensions={setRemoveDimensions}
            removeFill={removeFill}
            setRemoveFill={setRemoveFill}
            removeStroke={removeStroke}
            setRemoveStroke={setRemoveStroke}
            useMemo={useMemo}
            setUseMemo={setUseMemo}
            useForwardRef={useForwardRef}
            setUseForwardRef={setUseForwardRef}
            prettier={prettier}
            setPrettier={setPrettier}
          />
          
          <div className="flex justify-center">
            <Button 
              onClick={generateReactComponent}
              size="lg"
              className="w-full max-w-md"
            >
              <Code className="w-4 h-4 mr-2" />
              {t('svgConverter.actions.generate')}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <SvgStatsSection svgInput={svgInput} getSvgStats={getSvgStats} />
          <ValidationSection errors={errors} isValid={isValid} />
          <OutputSection reactComponent={reactComponent} copyToClipboard={copyToClipboard} />
        </div>
      </div>
    </div>
  );
} 