export class JsonUtilsService {
  /**
   * Copia texto para clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error);
      return false;
    }
  }

  /**
   * Filtra objeto JSON baseado em termo de busca
   */
  static filterJsonBySearch(obj: unknown, searchTerm: string): unknown {
    if (!searchTerm.trim()) {
      return obj;
    }

    const term = searchTerm.toLowerCase();

    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(term) ? obj : null;
    }

    if (typeof obj === 'number') {
      return obj.toString().includes(term) ? obj : null;
    }

    if (typeof obj === 'boolean') {
      return obj.toString().includes(term) ? obj : null;
    }

    if (obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      const filtered = obj
        .map(item => this.filterJsonBySearch(item, searchTerm))
        .filter(item => item !== null);
      return filtered.length > 0 ? filtered : null;
    }

    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      let hasMatch = false;

      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const filteredValue = this.filterJsonBySearch(value, searchTerm);
        if (filteredValue !== null) {
          result[key] = filteredValue;
          hasMatch = true;
        }
      }

      return hasMatch ? result : null;
    }

    return null;
  }

  /**
   * Calcula estatísticas do JSON
   */
  static getJsonStats(obj: unknown): {
    totalKeys: number;
    totalValues: number;
    maxDepth: number;
    sizeInBytes: number;
  } {
    const stats = {
      totalKeys: 0,
      totalValues: 0,
      maxDepth: 0,
      sizeInBytes: 0
    };

    this.analyzeJson(obj, stats, 0);
    stats.sizeInBytes = new Blob([JSON.stringify(obj)]).size;

    return stats;
  }

  /**
   * Analisa JSON recursivamente para estatísticas
   */
  private static analyzeJson(
    obj: unknown, 
    stats: { totalKeys: number; totalValues: number; maxDepth: number }, 
    depth: number
  ): void {
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    if (obj === null || typeof obj !== 'object') {
      stats.totalValues++;
      return;
    }

    if (Array.isArray(obj)) {
      stats.totalValues++;
      obj.forEach(item => this.analyzeJson(item, stats, depth + 1));
    } else {
      stats.totalKeys += Object.keys(obj as Record<string, unknown>).length;
      stats.totalValues++;
      
      for (const value of Object.values(obj as Record<string, unknown>)) {
        this.analyzeJson(value, stats, depth + 1);
      }
    }
  }

  /**
   * Valida se um caminho existe no objeto
   */
  static pathExists(obj: unknown, path: string): boolean {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || typeof current !== 'object') {
        return false;
      }

      if (Array.isArray(current)) {
        const index = parseInt(key);
        if (isNaN(index) || index < 0 || index >= current.length) {
          return false;
        }
        current = current[index];
      } else {
        if (!(key in (current as Record<string, unknown>))) {
          return false;
        }
        current = (current as Record<string, unknown>)[key];
      }
    }

    return true;
  }

  /**
   * Obtém valor de um caminho específico
   */
  static getValueByPath(obj: unknown, path: string): unknown {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || typeof current !== 'object') {
        return undefined;
      }

      if (Array.isArray(current)) {
        const index = parseInt(key);
        if (isNaN(index) || index < 0 || index >= current.length) {
          return undefined;
        }
        current = current[index];
      } else {
        if (!(key in (current as Record<string, unknown>))) {
          return undefined;
        }
        current = (current as Record<string, unknown>)[key];
      }
    }

    return current;
  }
} 