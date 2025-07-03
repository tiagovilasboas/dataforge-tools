import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { TopBar } from "@/components/shared/TopBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";

// Lazy loading das features
const Home = lazy(() => import("@/features/home/Home").then(module => ({ default: module.Home })));
const JsonTools = lazy(() => import("@/features/json-validator/JsonTools").then(module => ({ default: module.JsonTools })));
const SvgConverter = lazy(() => import("@/features/svg-converter/SvgConverter").then(module => ({ default: module.SvgConverter })));
const CsvTools = lazy(() => import("@/features/csv-validator/CsvTools").then(module => ({ default: module.CsvTools })));
const JwtDecoder = lazy(() => import("@/features/jwt-decoder/JwtDecoder").then(module => ({ default: module.JwtDecoder })));
const MockGenerator = lazy(() => import("@/features/mock-generator/MockGenerator").then(module => ({ default: module.MockGenerator })));
const RegexTester = lazy(() => import("@/features/regex-tester/RegexTester").then(module => ({ default: module.RegexTester })));



// Componente de erro para fallback
function ErrorFallback({ resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-xl font-semibold">Algo deu errado</h2>
        <p className="text-muted-foreground max-w-md">
          Houve um erro ao carregar esta página. Tente novamente.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}

function Layout() {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${currentTheme}`}>
      {/* Top Bar */}
      <TopBar />
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner variant="branded" text="Carregando ferramenta..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/json" element={<JsonTools />} />
              <Route path="/svg" element={<SvgConverter />} />
              <Route path="/csv" element={<CsvTools />} />
              <Route path="/jwt" element={<JwtDecoder />} />
              <Route path="/mock" element={<MockGenerator />} />
              <Route path="/regex" element={<RegexTester />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
