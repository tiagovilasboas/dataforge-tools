# DataForge Tools

DataForge Tools é uma suíte de ferramentas para validação, conversão e manipulação de dados, construída com foco em produtividade, boas práticas de arquitetura e experiência do usuário. O projeto utiliza React, TypeScript, Vite, Tailwind CSS, Shadcn UI e Zod para validação.

## ✨ Funcionalidades
- **Validador de JSON**
- **Validador de CSV**
- **Decodificador de JWT**
- **Gerador de Mock (dados fictícios)**
- **Testador de Regex**
- **Conversor de SVG**

## 🚀 Tecnologias Utilizadas
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Zod (validação)
- React Router
- next-themes (tema)
- Internacionalização (i18n) com arquivos `pt.json` e `en.json`

## 🏗️ Arquitetura & Boas Práticas

### Separação de Responsabilidades (SRP)
Cada módulo em `src/features/` segue o padrão:

```
src/features/nome-do-modulo/
├── schema.ts          # Schemas Zod
├── useFeature.ts      # Hook de lógica
└── Feature.tsx        # Componente UI
```

- **schema.ts**: Schemas de validação com Zod
- **useFeature.ts**: Hook customizado para lógica de estado e validação
- **Feature.tsx**: Componente principal responsável apenas pela UI

### Padrões de Código
- Tipagem explícita, sem `any`
- Tratamento de erros com `instanceof ZodError`
- Lógica separada da UI
- Hooks customizados para estado complexo
- Componentes pequenos e focados
- Early returns para evitar aninhamento
- Objetos de configuração ao invés de `.map` complexo
- Traduções obrigatórias para todo texto visível

#### Exemplo de Hook
```typescript
export function useFeature() {
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [valid, setValid] = useState(false);

  const validate = () => {
    try {
      const parsed = JSON.parse(input);
      featureSchema.parse(parsed);
      setValid(true);
      setErrors([]);
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map((err) => `${err.path.join(".")} → ${err.message}`));
      }
    }
  };

  return { input, setInput, errors, valid, validate };
}
```

### Internacionalização (i18n)
- Traduções em `src/i18n/locales/pt.json` e `en.json`
- Use sempre `useTranslation()` nos componentes
- Chaves descritivas e hierárquicas

## 📁 Estrutura de Pastas
```
src/
  components/      # Componentes compartilhados e UI (Shadcn)
  contexts/        # Contextos globais
  features/        # Cada ferramenta isolada por SRP
  hooks/           # Hooks customizados
  i18n/            # Internacionalização
  lib/             # Utilitários e temas
  styles/          # Temas e CSS
```

## 🛠️ Como rodar o projeto
```bash
pnpm install
pnpm dev
```
Acesse: http://localhost:5173 (ou porta sugerida pelo Vite)

## 🤝 Como contribuir
1. Crie uma branch: `git checkout -b minha-feature`
2. Siga o padrão de módulos e traduções
3. Faça commits descritivos
4. Abra um Pull Request

## 📜 Licença
MIT

---

> Projeto criado por Tiago Vilas Boas e colaboradores. Sinta-se livre para sugerir melhorias!
