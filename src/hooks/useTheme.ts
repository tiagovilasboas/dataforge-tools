import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getThemeClass, getModuleInfo } from "@/lib/themes";

export function useTheme() {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState("theme-home");
  const [moduleInfo, setModuleInfo] = useState(getModuleInfo("/"));

  useEffect(() => {
    const themeClass = getThemeClass(location.pathname);
    const info = getModuleInfo(location.pathname);
    
    setCurrentTheme(themeClass);
    setModuleInfo(info);
  }, [location.pathname]);

  return {
    currentTheme,
    moduleInfo,
    pathname: location.pathname
  };
} 