import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-validation': ['zod'],
          'vendor-utils': ['json5', 'papaparse', 'react-json-pretty'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'vendor-animation': ['framer-motion', 'howler'],
          'vendor-theme': ['next-themes'],
          
          // Feature chunks - cada feature em seu próprio chunk
          'feature-home': ['./src/features/home/Home.tsx'],
          'feature-json': ['./src/features/json-validator/JsonTools.tsx'],
          'feature-csv': ['./src/features/csv-validator/CsvTools.tsx'],
          'feature-jwt': ['./src/features/jwt-decoder/JwtDecoder.tsx'],
          'feature-regex': ['./src/features/regex-tester/RegexTester.tsx'],
          'feature-mock': ['./src/features/mock-generator/MockGenerator.tsx'],
          'feature-svg': ['./src/features/svg-converter/SvgConverter.tsx'],
          
          // Shared components
          'shared-components': ['./src/components/shared/TopBar.tsx', './src/components/shared/LanguageSwitch.tsx'],
          'ui-components': ['./src/components/ui/button.tsx', './src/components/ui/card.tsx', './src/components/ui/input.tsx'],
        }
      }
    },
    // Otimizações de build
    target: 'esnext',
    minify: 'esbuild',
    // Análise de bundle
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'zod',
      'i18next',
      'react-i18next'
    ],
  },
  // Preload de módulos críticos
  server: {
    hmr: {
      overlay: false,
    },
  },
})
