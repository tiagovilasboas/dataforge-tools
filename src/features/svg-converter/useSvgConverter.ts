import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { svgConverterSchema, svgValidationSchema, type SvgConverterConfig } from "./schema";

// Tipos para melhor organização
interface SvgAttributes {
  viewBox: string;
  originalWidth: string;
  originalHeight: string;
  fill?: string;
  stroke?: string;
}

interface ComponentConfig {
  name: string;
  size: number;
  color: string;
  includeProps: boolean;
  includeClassName: boolean;
  optimizeSvg: boolean;
  useTypeScript: boolean;
  useNamedExport: boolean;
  removeViewBox: boolean;
  removeDimensions: boolean;
  removeFill: boolean;
  removeStroke: boolean;
  useMemo: boolean;
  useForwardRef: boolean;
  prettier: boolean;
}

export function useSvgConverter() {
  // Estado principal
  const [svgInput, setSvgInput] = useState("");
  const [componentName, setComponentName] = useState("MyIcon");
  const [defaultSize, setDefaultSize] = useState(24);
  const [defaultColor, setDefaultColor] = useState("currentColor");
  
  // Configurações básicas
  const [includeProps, setIncludeProps] = useState(true);
  const [includeClassName, setIncludeClassName] = useState(true);
  const [optimizeSvg, setOptimizeSvg] = useState(true);
  
  // Configurações avançadas
  const [useTypeScript, setUseTypeScript] = useState(true);
  const [useNamedExport, setUseNamedExport] = useState(true);
  const [removeViewBox, setRemoveViewBox] = useState(false);
  const [removeDimensions, setRemoveDimensions] = useState(false);
  const [removeFill, setRemoveFill] = useState(false);
  const [removeStroke, setRemoveStroke] = useState(false);
  const [useMemo, setUseMemo] = useState(false);
  const [useForwardRef, setUseForwardRef] = useState(false);
  const [prettier, setPrettier] = useState(true);
  
  // Estado de resultado
  const [errors, setErrors] = useState<string[]>([]);
  const [reactComponent, setReactComponent] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Função de validação SVG (responsabilidade única)
  const validateSvg = useCallback((svg: string): boolean => {
    try {
      svgValidationSchema.parse({ svg });
      return true;
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map((err) => err.message));
      }
      return false;
    }
  }, []);

  // Função de otimização SVG (responsabilidade única)
  const optimizeSvgCode = useCallback((svg: string): string => {
    if (!optimizeSvg) return svg;
    
    return svg
      // Remove comentários
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove espaços desnecessários
      .replace(/\s+/g, ' ')
      // Remove linhas vazias
      .replace(/\n\s*\n/g, '\n')
      // Remove espaços no final das linhas
      .replace(/\s+$/gm, '')
      .trim();
  }, [optimizeSvg]);

  // Função de extração de atributos SVG (responsabilidade única)
  const extractSvgAttributes = useCallback((svg: string): SvgAttributes => {
    const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/);
    const widthMatch = svg.match(/width=["']([^"']+)["']/);
    const heightMatch = svg.match(/height=["']([^"']+)["']/);
    const fillMatch = svg.match(/fill=["']([^"']+)["']/);
    const strokeMatch = svg.match(/stroke=["']([^"']+)["']/);
    
    return {
      viewBox: viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24",
      originalWidth: widthMatch ? widthMatch[1] : "24",
      originalHeight: heightMatch ? heightMatch[1] : "24",
      fill: fillMatch ? fillMatch[1] : undefined,
      stroke: strokeMatch ? strokeMatch[1] : undefined,
    };
  }, []);

  // Função de processamento de atributos SVG (responsabilidade única)
  const processSvgAttributes = useCallback((svg: string, config: ComponentConfig): string => {
    let processedSvg = svg;
    
    // Remove atributos conforme configuração
    if (config.removeViewBox) {
      processedSvg = processedSvg.replace(/viewBox=["'][^"']*["']/g, '');
    }
    
    if (config.removeDimensions) {
      processedSvg = processedSvg.replace(/width=["'][^"']*["']/g, '');
      processedSvg = processedSvg.replace(/height=["'][^"']*["']/g, '');
    }
    
    if (config.removeFill) {
      processedSvg = processedSvg.replace(/fill=["'][^"']*["']/g, '');
    }
    
    if (config.removeStroke) {
      processedSvg = processedSvg.replace(/stroke=["'][^"']*["']/g, '');
    }
    
    return processedSvg;
  }, []);

  // Função de geração de interface TypeScript (responsabilidade única)
  const generateTypeScriptInterface = useCallback((config: ComponentConfig): string => {
    if (!config.useTypeScript || !config.includeProps) return '';
    
    const props = ['size?: number', 'color?: string'];
    if (config.includeClassName) props.push('className?: string');
    
    return `
interface ${config.name}Props {
  ${props.join(';\n  ')};${config.useForwardRef ? '\n  ref?: React.Ref<SVGSVGElement>;' : ''}
}`;
  }, []);

  // Função de geração do conteúdo SVG (responsabilidade única)
  const generateSvgContent = useCallback((svg: string): string => {
    return svg
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>/, '')
      .trim();
  }, []);

  // Função de formatação do código (responsabilidade única)
  const formatCode = useCallback((code: string): string => {
    if (!prettier) return code;
    
    // Formatação básica - em produção seria melhor usar prettier
    return code
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove múltiplas linhas vazias
      .replace(/\s+$/gm, '') // Remove espaços no final das linhas
      .trim();
  }, [prettier]);

  // Função de preview SVG (responsabilidade única)
  const generateSvgPreview = useCallback((svg: string, size: number = 100, color: string = "currentColor"): string => {
    if (!svg.trim()) return '';
    
    try {
      // Validação básica
      if (!validateSvg(svg)) return '';
      
      // Otimização
      const optimizedSvg = optimizeSvgCode(svg);
      
      // Substitui cores para preview
      const previewSvg = optimizedSvg
        .replace(/fill="[^"]*"/g, `fill="${color}"`)
        .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
        .replace(/width="[^"]*"/g, `width="${size}"`)
        .replace(/height="[^"]*"/g, `height="${size}"`);
      
      return previewSvg;
    } catch {
      return '';
    }
  }, [validateSvg, optimizeSvgCode]);

  // Função de estatísticas SVG (responsabilidade única)
  const getSvgStats = useCallback((svg: string) => {
    if (!svg.trim()) return null;
    
    try {
      const originalSize = svg.length;
      const optimizedSvg = optimizeSvgCode(svg);
      const optimizedSize = optimizedSvg.length;
      const sizeReduction = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(1) : '0';
      
      // Conta elementos SVG
      const pathCount = (svg.match(/<path/g) || []).length;
      const circleCount = (svg.match(/<circle/g) || []).length;
      const rectCount = (svg.match(/<rect/g) || []).length;
      const lineCount = (svg.match(/<line/g) || []).length;
      const polygonCount = (svg.match(/<polygon/g) || []).length;
      const polylineCount = (svg.match(/<polyline/g) || []).length;
      const ellipseCount = (svg.match(/<ellipse/g) || []).length;
      
      const totalElements = pathCount + circleCount + rectCount + lineCount + polygonCount + polylineCount + ellipseCount;
      
      // Extrai viewBox
      const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/);
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
      
      return {
        originalSize,
        optimizedSize,
        sizeReduction: `${sizeReduction}%`,
        totalElements,
        elements: {
          paths: pathCount,
          circles: circleCount,
          rectangles: rectCount,
          lines: lineCount,
          polygons: polygonCount,
          polylines: polylineCount,
          ellipses: ellipseCount,
        },
        viewBox,
      };
    } catch {
      return null;
    }
  }, [optimizeSvgCode]);

  // Função principal de geração de componente (orquestra as outras)
  const generateReactComponent = useCallback(() => {
    try {
      // Configuração completa
      const config: ComponentConfig = {
        name: componentName,
        size: defaultSize,
        color: defaultColor,
        includeProps,
        includeClassName,
        optimizeSvg,
        useTypeScript,
        useNamedExport,
        removeViewBox,
        removeDimensions,
        removeFill,
        removeStroke,
        useMemo,
        useForwardRef,
        prettier,
      };
      
      // Validação da configuração
      const validationConfig: SvgConverterConfig = {
        svgInput,
        componentName,
        includeProps,
        defaultSize,
        defaultColor,
        includeClassName,
        optimizeSvg,
        useTypeScript,
        useNamedExport,
        removeViewBox,
        removeDimensions,
        removeFill,
        removeStroke,
        useMemo,
        useForwardRef,
        prettier,
      };
      
      svgConverterSchema.parse(validationConfig);
      
      // Validação SVG
      if (!validateSvg(svgInput)) {
        return;
      }

      // Processamento do SVG
      const optimizedSvg = optimizeSvgCode(svgInput);
      const processedSvg = processSvgAttributes(optimizedSvg, config);
      const { viewBox } = extractSvgAttributes(processedSvg);
      const svgContent = generateSvgContent(processedSvg);

      // Geração do código
      const propsInterface = generateTypeScriptInterface(config);
             const exportKeyword = config.useNamedExport ? 'export function' : 'export const';
       const memoWrapper = config.useMemo ? 'React.memo(' : '';
       const memoClose = config.useMemo ? ')' : '';
       const forwardRefWrapper = config.useForwardRef ? 'React.forwardRef<SVGSVGElement, ' : '';
       const forwardRefClose = config.useForwardRef ? '>' : '';
       const refProp = config.useForwardRef ? '\n      ref={ref}' : '';
      
      const props = config.includeProps ? 
        `{ 
  size = ${config.size}, 
  color = "${config.color}"${config.includeClassName ? ',\n  className' : ''}${config.useForwardRef ? ',\n  ref' : ''}
}` : '';

      const component = `import React from 'react';${propsInterface}

${memoWrapper}${forwardRefWrapper}${exportKeyword} ${config.name}(${props})${forwardRefClose} {
  return (
    <svg 
      width={size} 
      height={size} 
      fill={color}${config.includeClassName ? '\n      className={className}' : ''}${refProp}
      viewBox="${viewBox}"
    >
      ${svgContent}
    </svg>
  );
}${memoClose}`;

      const formattedComponent = formatCode(component);
      
      setReactComponent(formattedComponent);
      setIsValid(true);
      setErrors([]);
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map((err) => `${err.path.join(".")} → ${err.message}`));
      } else {
        setErrors(["Failed to generate React component"]);
      }
      setIsValid(false);
    }
  }, [
    svgInput,
    componentName,
    defaultSize,
    defaultColor,
    includeProps,
    includeClassName,
    optimizeSvg,
    useTypeScript,
    useNamedExport,
    removeViewBox,
    removeDimensions,
    removeFill,
    removeStroke,
    useMemo,
    useForwardRef,
    prettier,
    validateSvg,
    optimizeSvgCode,
    processSvgAttributes,
    extractSvgAttributes,
    generateSvgContent,
    generateTypeScriptInterface,
    formatCode,
  ]);

  // Função de carregamento de exemplo (responsabilidade única)
  const loadSampleSvg = useCallback(() => {
    const sampleSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- This is a sample icon with multiple paths -->
  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Additional decorative elements -->
  <circle cx="12" cy="7" r="1" fill="currentColor"/>
  <circle cx="12" cy="17" r="1" fill="currentColor"/>
</svg>`;
    
    setSvgInput(sampleSvg);
    setComponentName("CubeIcon");
  }, []);

  // Função de cópia para clipboard (responsabilidade única)
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reactComponent);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [reactComponent]);

  return {
    // Estado
    svgInput,
    componentName,
    defaultSize,
    defaultColor,
    includeProps,
    includeClassName,
    optimizeSvg,
    useTypeScript,
    useNamedExport,
    removeViewBox,
    removeDimensions,
    removeFill,
    removeStroke,
    useMemo,
    useForwardRef,
    prettier,
    errors,
    reactComponent,
    isValid,
    
    // Actions
    setSvgInput,
    setComponentName,
    setDefaultSize,
    setDefaultColor,
    setIncludeProps,
    setIncludeClassName,
    setOptimizeSvg,
    setUseTypeScript,
    setUseNamedExport,
    setRemoveViewBox,
    setRemoveDimensions,
    setRemoveFill,
    setRemoveStroke,
    setUseMemo,
    setUseForwardRef,
    setPrettier,
    generateReactComponent,
    loadSampleSvg,
    copyToClipboard,
    generateSvgPreview,
    getSvgStats,
  };
} 