import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Layers, HardDrive } from "lucide-react";

interface JsonStatsProps {
  stats: {
    totalKeys: number;
    totalValues: number;
    maxDepth: number;
    sizeInBytes: number;
  } | null;
}

export function JsonStats({ stats }: JsonStatsProps) {
  if (!stats) return null;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDepthColor = (depth: number): string => {
    if (depth <= 2) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (depth <= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getSizeColor = (bytes: number): string => {
    if (bytes <= 1024) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (bytes <= 10240) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Estatísticas do JSON
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats.totalKeys}</div>
            <div className="text-sm text-muted-foreground">Chaves</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{stats.totalValues}</div>
            <div className="text-sm text-muted-foreground">Valores</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{stats.maxDepth}</div>
            <div className="text-sm text-muted-foreground">Profundidade</div>
            <Badge className={`mt-1 text-xs ${getDepthColor(stats.maxDepth)}`}>
              {stats.maxDepth <= 2 ? 'Simples' : stats.maxDepth <= 4 ? 'Médio' : 'Complexo'}
            </Badge>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <HardDrive className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{formatBytes(stats.sizeInBytes)}</div>
            <div className="text-sm text-muted-foreground">Tamanho</div>
            <Badge className={`mt-1 text-xs ${getSizeColor(stats.sizeInBytes)}`}>
              {stats.sizeInBytes <= 1024 ? 'Pequeno' : stats.sizeInBytes <= 10240 ? 'Médio' : 'Grande'}
            </Badge>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Densidade de dados:</span>
            <span className="font-medium">
              {stats.totalKeys > 0 ? (stats.totalValues / stats.totalKeys).toFixed(1) : 0} valores/chave
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 