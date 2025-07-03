import React from "react";
import { Zap, Code, FileSpreadsheet, Shield, Database, Search, Image, Menu, Gamepad2 } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from "@/components/ui/button";
import { DinoGame } from "./DinoGame";

export function TopBar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [isDinoGameVisible, setIsDinoGameVisible] = React.useState(false);

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
    <>
      <div className="sticky top-0 z-50 flex h-12 items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Hambúrguer à esquerda em mobile */}
        <div className="flex items-center md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-2 mt-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'text-foreground dark:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo centralizado em mobile, à esquerda em desktop */}
        <div className="flex flex-1 md:flex-none items-center justify-center md:justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-base font-bold hover:text-primary transition-colors"
          >
            <Zap className="w-5 h-5" />
            DataForge Tools
          </Link>
        </div>

        {/* Menu normal em md+ */}
        <div className="hidden md:flex flex-1 md:flex-none items-center justify-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDinoGameVisible(!isDinoGameVisible)}
            className="flex items-center gap-1"
            title="Dino Game"
          >
            <Gamepad2 className="w-4 h-4" />
          </Button>
          <LanguageSwitch />
        </div>
      </div>

      {/* Dino Game */}
      <DinoGame 
        isVisible={isDinoGameVisible} 
        onToggle={() => setIsDinoGameVisible(false)} 
      />
    </>
  );
} 