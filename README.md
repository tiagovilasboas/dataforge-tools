# DataForge Tools 🛠️

Este é um **exercício de código pessoal** onde reuni todas as ferramentas que mais utilizo no dia a dia como desenvolvedor em uma única aplicação web. O objetivo foi praticar boas práticas de arquitetura, separação de responsabilidades (SRP) e criar uma interface unificada para essas ferramentas essenciais.

## ✨ Ferramentas Incluídas

- **Validador de JSON** - Validação e formatação de JSON
- **Validador de CSV** - Validação e preview de dados CSV
- **Decodificador de JWT** - Decodificação e validação de tokens JWT
- **Gerador de Mock** - Geração de dados fictícios para testes
- **Testador de Regex** - Teste e validação de expressões regulares
- **Conversor de SVG** - Conversão de SVG para componentes React

## 🚀 Tecnologias Utilizadas

- **React + TypeScript** - Interface moderna e tipagem segura
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Estilização utilitária
- **Shadcn UI** - Componentes de interface consistentes
- **Zod** - Validação de schemas
- **React Router** - Navegação entre ferramentas
- **next-themes** - Suporte a temas claro/escuro
- **i18n** - Internacionalização (PT/EN)

## 🏗️ Arquitetura & Boas Práticas

### Separação de Responsabilidades (SRP)
Cada módulo segue o padrão de 3 arquivos:

```
src/features/nome-do-modulo/
├── schema.ts          # Schemas Zod para validação
├── useFeature.ts      # Hook customizado com lógica de negócio
└── Feature.tsx        # Componente focado apenas na UI
```

### Exemplo de Implementação
```typescript
// schema.ts - Validação
export const featureSchema = z.object({
  input: z.string().min(1, "Campo obrigatório"),
  // ... outros campos
});

// useFeature.ts - Lógica
export function useFeature() {
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  
  const validate = () => {
    try {
      featureSchema.parse({ input });
      setErrors([]);
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map(err => `${err.path.join(".")} → ${err.message}`));
      }
    }
  };
  
  return { input, setInput, errors, validate };
}

// Feature.tsx - UI
export function Feature() {
  const { input, setInput, errors, validate } = useFeature();
  
  return (
    <div>
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      {errors.map(error => <p key={error}>{error}</p>)}
      <Button onClick={validate}>Validar</Button>
    </div>
  );
}
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes Shadcn UI
│   └── shared/       # Componentes compartilhados (TopBar, LanguageSwitch)
├── features/         # Módulos das ferramentas
│   ├── json-validator/
│   ├── csv-validator/
│   ├── jwt-decoder/
│   ├── mock-generator/
│   ├── regex-tester/
│   └── svg-converter/
├── hooks/            # Hooks customizados
├── i18n/             # Internacionalização
├── lib/              # Utilitários e configurações
└── styles/           # Estilos e temas
```

## 🎯 Objetivos do Exercício

### **Aprendizado Técnico**
- ✅ Praticar **SRP** (Single Responsibility Principle)
- ✅ Separar lógica de negócio da UI
- ✅ Usar **hooks customizados** para estado complexo
- ✅ Implementar **validação robusta** com Zod
- ✅ Criar **componentes reutilizáveis**
- ✅ Aplicar **tipagem TypeScript** rigorosa

### **Organização de Código**
- ✅ **Estrutura modular** por feature
- ✅ **Schemas centralizados** para validação
- ✅ **Traduções organizadas** e consistentes
- ✅ **Componentes pequenos** e focados
- ✅ **Early returns** para reduzir aninhamento

### **Experiência do Usuário**
- ✅ **Interface unificada** para todas as ferramentas
- ✅ **Tema claro/escuro** automático
- ✅ **Suporte a idiomas** (PT/EN)
- ✅ **Responsividade** completa
- ✅ **Feedback visual** claro

## 🚀 Como Executar

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build
pnpm preview
```

## 🛠️ Ferramentas Incluídas

### **JSON Validator**
- Validação de sintaxe JSON
- Formatação automática
- Highlighting de erros
- Exemplos práticos

### **CSV Validator**
- Validação de estrutura CSV
- Preview de dados
- Detecção de problemas
- Estatísticas do arquivo

### **JWT Decoder**
- Decodificação de tokens JWT
- Validação de assinatura
- Visualização de payload
- Informações do header

### **Mock Generator**
- Geração de dados fictícios
- Múltiplos tipos de dados
- Configuração flexível
- Export em JSON/CSV

### **Regex Tester**
- Teste de expressões regulares
- Exemplos pré-definidos
- Highlighting de matches
- Substituição de texto

### **SVG Converter**
- Conversão SVG → React
- Configurações avançadas
- Preview em tempo real
- Otimização automática

## 📚 Aprendizados

Este exercício me permitiu:

1. **Praticar arquitetura limpa** com separação clara de responsabilidades
2. **Melhorar organização de código** com padrões consistentes
3. **Aplicar TypeScript rigoroso** com tipagem explícita
4. **Criar componentes reutilizáveis** seguindo SRP
5. **Implementar validação robusta** com tratamento de erros
6. **Organizar traduções** de forma escalável
7. **Criar interface unificada** para múltiplas ferramentas

## 🤝 Contribuição

Este é um projeto pessoal de exercício, mas sugestões e melhorias são bem-vindas! Se quiser contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é um exercício pessoal de código. Sinta-se livre para usar como referência ou inspiração para seus próprios projetos.

---

**Desenvolvido como exercício de código para praticar boas práticas de arquitetura e organização de código.** 🎯
