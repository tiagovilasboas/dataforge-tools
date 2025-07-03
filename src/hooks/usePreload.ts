import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Mapeamento de rotas para módulos
const routeToModule: Record<string, () => Promise<unknown>> = {
  '/json': () => import('@/features/json-validator/JsonTools'),
  '/csv': () => import('@/features/csv-validator/CsvTools'),
  '/jwt': () => import('@/features/jwt-decoder/JwtDecoder'),
  '/regex': () => import('@/features/regex-tester/RegexTester'),
  '/mock': () => import('@/features/mock-generator/MockGenerator'),
  '/svg': () => import('@/features/svg-converter/SvgConverter'),
};

// Módulos relacionados para preloading
const relatedModules: Record<string, string[]> = {
  '/json': ['/csv'], // JSON e CSV são relacionados
  '/csv': ['/json'],
  '/jwt': ['/regex'], // JWT e Regex são relacionados
  '/regex': ['/jwt'],
  '/mock': ['/json', '/csv'], // Mock usa JSON e CSV
  '/svg': [], // SVG é independente
};

export function usePreload() {
  const location = useLocation();

  // Preload do módulo atual
  const preloadCurrentModule = useCallback(() => {
    const moduleLoader = routeToModule[location.pathname];
    if (moduleLoader) {
      moduleLoader().catch(console.error);
    }
  }, [location.pathname]);

  // Preload de módulos relacionados
  const preloadRelatedModules = useCallback(() => {
    const related = relatedModules[location.pathname] || [];
    related.forEach(route => {
      const moduleLoader = routeToModule[route];
      if (moduleLoader) {
        // Preload com baixa prioridade
        setTimeout(() => {
          moduleLoader().catch(console.error);
        }, 1000);
      }
    });
  }, [location.pathname]);

  // Preload de todos os módulos (para desenvolvimento)
  const preloadAllModules = useCallback(() => {
    Object.values(routeToModule).forEach(moduleLoader => {
      moduleLoader().catch(console.error);
    });
  }, []);

  // Preload baseado em hover (para links)
  const preloadOnHover = useCallback((route: string) => {
    const moduleLoader = routeToModule[route];
    if (moduleLoader) {
      moduleLoader().catch(console.error);
    }
  }, []);

  // Preload baseado em proximidade (para links próximos)
  const preloadNearbyModules = useCallback((currentRoute: string) => {
    const nearbyRoutes = Object.keys(routeToModule).filter(route => route !== currentRoute);
    nearbyRoutes.forEach(route => {
      const moduleLoader = routeToModule[route];
      if (moduleLoader) {
        // Preload com delay para não impactar performance
        setTimeout(() => {
          moduleLoader().catch(console.error);
        }, 2000);
      }
    });
  }, []);

  // Efeito para preload automático
  useEffect(() => {
    // Preload do módulo atual imediatamente
    preloadCurrentModule();
    
    // Preload de módulos relacionados com delay
    const relatedTimer = setTimeout(preloadRelatedModules, 500);
    
    // Preload de módulos próximos com delay maior
    const nearbyTimer = setTimeout(() => {
      preloadNearbyModules(location.pathname);
    }, 3000);

    return () => {
      clearTimeout(relatedTimer);
      clearTimeout(nearbyTimer);
    };
  }, [location.pathname, preloadCurrentModule, preloadRelatedModules, preloadNearbyModules]);

  return {
    preloadCurrentModule,
    preloadRelatedModules,
    preloadAllModules,
    preloadOnHover,
    preloadNearbyModules,
  };
}

// Hook para preload baseado em intenção do usuário
export function useIntentionalPreload() {
  const { preloadOnHover } = usePreload();

  const handleLinkHover = useCallback((route: string) => {
    preloadOnHover(route);
  }, [preloadOnHover]);

  const handleLinkFocus = useCallback((route: string) => {
    preloadOnHover(route);
  }, [preloadOnHover]);

  return {
    handleLinkHover,
    handleLinkFocus,
  };
} 