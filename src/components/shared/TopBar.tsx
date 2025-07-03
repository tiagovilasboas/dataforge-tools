import { Zap, Code, FileSpreadsheet, Shield, Database, Search, Image } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function TopBar() {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      path: "/json",
      label: t('navigation.jsonTools'),
      icon: Code,
    },
    {
      path: "/csv",
      label: t('navigation.csvTools'),
      icon: FileSpreadsheet,
    },
    {
      path: "/jwt",
      label: t('navigation.jwtDecoder'),
      icon: Shield,
    },
    {
      path: "/regex",
      label: t('navigation.regexTester'),
      icon: Search,
    },
    {
      path: "/mock",
      label: t('navigation.mockGenerator'),
      icon: Database,
    },
    {
      path: "/svg",
      label: t('navigation.svgConverter'),
      icon: Image,
    }
  ];

  return (
    <div className="sticky top-0 z-50 flex h-12 items-center bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Hambúrguer à esquerda em mobile */}
      <div className="flex items-center md:hidden mr-2">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded hover:bg-muted focus:outline-none" aria-label="Abrir menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 max-w-full p-6 flex flex-col text-foreground">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-base font-medium mb-2 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground dark:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo centralizado em mobile, à esquerda em desktop */}
      <div className="flex flex-1 items-center justify-center md:justify-start">
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-bold hover:text-primary transition-colors"
        >
          <Zap className="w-5 h-5" />
          DataForge Tools
        </Link>
      </div>

      {/* Menu normal em md+ */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-sm font-medium ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Language Switch à direita */}
      <div className="flex items-center">
        <LanguageSwitch />
      </div>
    </div>
  );
} 