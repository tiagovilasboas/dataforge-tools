// Configuração de cores por módulo - Paleta crescente
export const moduleColors = {
  home: {
    name: "neutral",
    primary: "slate",
    class: "theme-home",
    description: "Tema base/neutro"
  },
  json: {
    name: "json",
    primary: "blue", 
    class: "theme-json",
    description: "Validador JSON - Azul"
  },
  csv: {
    name: "csv",
    primary: "green",
    class: "theme-csv", 
    description: "Validador CSV - Verde"
  },
  jwt: {
    name: "jwt",
    primary: "violet",
    class: "theme-jwt",
    description: "Decoder JWT - Violeta"
  },
  regex: {
    name: "regex", 
    primary: "orange",
    class: "theme-regex",
    description: "Testador Regex - Laranja"
  },
  mock: {
    name: "mock",
    primary: "red",
    class: "theme-mock",
    description: "Gerador Mock - Vermelho"
  },
  svg: {
    name: "svg",
    primary: "yellow",
    class: "theme-svg",
    description: "Conversor SVG - Amarelo"
  }
} as const;

export const themes = {
  neutral: "slate",
  json: "blue",
  csv: "green", 
  jwt: "violet",
  regex: "orange",
  mock: "red",
  svg: "yellow"
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeColor = typeof themes[ThemeName];
export type ModuleName = keyof typeof moduleColors;

// Mapeamento de rotas para temas
export const routeThemes: Record<string, ThemeName> = {
  "/": "neutral",
  "/json": "json",
  "/csv": "csv",
  "/jwt": "jwt", 
  "/regex": "regex",
  "/mock": "mock",
  "/svg": "svg"
};

// Função para obter a classe CSS do tema baseada na rota
export function getThemeClass(pathname: string): string {
  const themeName = routeThemes[pathname] || "neutral";
  
  // Mapeamento direto para simplificar
  const themeClassMap: Record<string, string> = {
    "neutral": "theme-home",
    "json": "theme-json",
    "csv": "theme-csv",
    "jwt": "theme-jwt",
    "regex": "theme-regex",
    "mock": "theme-mock",
    "svg": "theme-svg"
  };
  
  return themeClassMap[themeName] || "theme-home";
}

// Função para obter informações do módulo
export function getModuleInfo(pathname: string) {
  const themeName = routeThemes[pathname] || "neutral";
  const moduleKey = Object.keys(moduleColors).find(
    key => moduleColors[key as ModuleName].name === themeName
  ) as ModuleName;
  
  return moduleColors[moduleKey] || moduleColors.home;
} 