# Sistema de Cores Segmentadas por Módulo

Este sistema implementa cores únicas para cada módulo do DataForge Tools, seguindo uma paleta crescente de cores.

## Paleta de Cores

### Sequência Crescente por Módulo:

1. **Home/Neutral** - Slate (Base/Neutro)
   - Cor: `slate-600` (#475569)
   - Classe: `theme-home`

2. **JSON Validator** - Azul
   - Cor: `blue-500` (#3B82F6)
   - Classe: `theme-json`

3. **CSV Validator** - Verde
   - Cor: `green-600` (#16A34A)
   - Classe: `theme-csv`

4. **JWT Decoder** - Violeta
   - Cor: `violet-500` (#8B5CF6)
   - Classe: `theme-jwt`

5. **Regex Tester** - Laranja
   - Cor: `orange-500` (#F97316)
   - Classe: `theme-regex`

6. **Mock Generator** - Vermelho
   - Cor: `red-500` (#EF4444)
   - Classe: `theme-mock`

7. **SVG Converter** - Amarelo
   - Cor: `yellow-500` (#EAB308)
   - Classe: `theme-svg`

## Como Funciona

### 1. Aplicação Automática
O tema é aplicado automaticamente baseado na rota atual:
- `/` → `theme-home`
- `/json` → `theme-json`
- `/csv` → `theme-csv`
- `/jwt` → `theme-jwt`
- `/regex` → `theme-regex`
- `/mock` → `theme-mock`
- `/svg` → `theme-svg`

### 2. Variáveis CSS
Cada tema define suas próprias variáveis CSS:
```css
.theme-json {
  --primary: var(--json-primary);
  --primary-foreground: var(--json-primary-foreground);
  --accent: var(--json-accent);
  --accent-foreground: var(--json-accent-foreground);
  --border: var(--json-border);
  --ring: var(--json-ring);
}
```

### 3. Hook useTheme
```typescript
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { currentTheme, moduleInfo } = useTheme();
  
  return (
    <div className={currentTheme}>
      {/* Conteúdo com cores do tema */}
    </div>
  );
}
```

## Uso nos Componentes

### Aplicação Automática
O tema é aplicado automaticamente no layout principal (`App.tsx`):
```typescript
function Layout() {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${currentTheme}`}>
      {/* Conteúdo */}
    </div>
  );
}
```

### Indicador Visual
O TopBar inclui um indicador visual do tema atual:
- Mostra a cor do tema atual
- Exibe a descrição do módulo
- Atualiza automaticamente ao navegar

## Benefícios

1. **Identificação Visual**: Cada módulo tem sua identidade visual única
2. **Consistência**: Cores seguem uma paleta harmoniosa
3. **Acessibilidade**: Contraste adequado em todos os temas
4. **Manutenibilidade**: Sistema centralizado e fácil de modificar
5. **Escalabilidade**: Fácil adicionar novos módulos com cores

## Adicionando Novos Módulos

1. Adicione as variáveis CSS em `module-colors.css`
2. Atualize `moduleColors` em `src/lib/themes.ts`
3. Adicione a rota em `routeThemes`
4. O sistema aplicará automaticamente as cores

## Estrutura de Arquivos

```
src/
├── styles/
│   └── themes/
│       ├── module-colors.css    # Variáveis CSS dos temas
│       └── README.md           # Esta documentação
├── lib/
│   └── themes.ts               # Configuração e funções
└── hooks/
    └── useTheme.ts             # Hook para gerenciar temas
``` 