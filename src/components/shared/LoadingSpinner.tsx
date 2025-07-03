import React from "react";
import { Loader2, Zap } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "default" | "branded";
  className?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  text = "Carregando...", 
  variant = "default",
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (variant === "branded") {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Zap className={`${sizeClasses[size]} text-primary animate-pulse`} />
            <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`}></div>
          </div>
          <div className="text-center space-y-2">
            <p className={`${textSizes[size]} text-muted-foreground font-medium`}>
              {text}
            </p>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className={`${textSizes[size]} text-muted-foreground`}>
          {text}
        </p>
      </div>
    </div>
  );
}

// Componente de loading para seções específicas
export function SectionLoader({ text = "Carregando seção..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}

// Componente de loading para botões
export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin`} />
  );
} 