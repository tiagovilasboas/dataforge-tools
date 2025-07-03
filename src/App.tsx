import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "@/features/home/Home";
import { JsonTools } from "@/features/json-validator/JsonTools";
import { SvgConverter } from "@/features/svg-converter/SvgConverter";
import { CsvTools } from "@/features/csv-validator/CsvTools";
import { JwtDecoder } from "@/features/jwt-decoder/JwtDecoder";
import { MockGenerator } from "@/features/mock-generator/MockGenerator";
import { RegexTester } from "@/features/regex-tester/RegexTester";
import { TopBar } from "@/components/shared/TopBar";
import { useTheme } from "@/hooks/useTheme";

function Layout() {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${currentTheme}`}>
      {/* Top Bar */}
      <TopBar />
      {/* Main Content */}
      <div className="flex-1 min-w-0">
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
