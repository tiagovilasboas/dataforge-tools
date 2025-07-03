import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";

interface SvgInputSectionProps {
  svgInput: string;
  setSvgInput: (value: string) => void;
  loadSampleSvg: () => void;
  generateSvgPreview: (svg: string, size?: number, color?: string) => string;
}

export function SvgInputSection({ 
  svgInput, 
  setSvgInput, 
  loadSampleSvg,
  generateSvgPreview
}: SvgInputSectionProps) {
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
        {/* Entrada SVG */}
        <div>
          <label className="text-sm font-medium">{t('svgConverter.input.svgCode')}</label>
          <Textarea
            placeholder={t('svgConverter.input.placeholder')}
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Preview SVG */}
        {previewSvg && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
              <div 
                className="flex items-center justify-center border rounded"
                style={{ 
                  width: previewSize, 
                  height: previewSize,
                  backgroundColor: 'white'
                }}
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Tamanho</label>
                  <Input
                    type="number"
                    value={previewSize}
                    onChange={(e) => setPreviewSize(Number(e.target.value))}
                    className="w-20 h-8 text-xs"
                    min="20"
                    max="200"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Cor</label>
                  <Input
                    type="color"
                    value={previewColor}
                    onChange={(e) => setPreviewColor(e.target.value)}
                    className="w-20 h-8 p-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button onClick={loadSampleSvg} variant="outline" className="flex items-center gap-2">
            {t('svgConverter.input.loadSample')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 