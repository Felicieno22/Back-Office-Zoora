import { useState, useEffect } from 'react';

// Service de cache intelligent pour les données constantes
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  
  // Durées de cache (en millisecondes)
  private readonly TTL = {
    ROLES: 24 * 60 * 60 * 1000,        // 24 heures - très constant
    GENRES: 24 * 60 * 60 * 1000,       // 24 heures - très constant  
    POSTES: 24 * 60 * 60 * 1000,       // 24 heures - très constant
    TYPE_MATERIEL: 24 * 60 * 60 * 1000, // 24 heures - très constant
    LANGUAGES: 24 * 60 * 60 * 1000,    // 24 heures - très constant
  };

  /**
   * Récupérer une donnée depuis le cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Vérifier si le cache est expiré
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      console.log(`🗑️ Cache expiré pour: ${key}`);
      return null;
    }
    
    console.log(`✅ Cache hit pour: ${key}`);
    return item.data;
  }

  /**
   * Stocker une donnée dans le cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const cacheKey = this.getCacheKey(key);
    const cacheTTL = ttl || this.getTTL(key);
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL
    });
    
    console.log(`💾 Cache set pour: ${key} (TTL: ${cacheTTL}ms)`);
  }

  /**
   * Invalider une entrée du cache
   */
  invalidate(key: string): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.delete(cacheKey);
    console.log(`🗑️ Cache invalidé pour: ${key}`);
  }

  /**
   * Vider tout le cache
   */
  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache entièrement vidé');
  }

  /**
   * Récupérer ou créer une donnée (pattern cache-aside)
   */
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Essayer de récupérer depuis le cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Si pas en cache, récupérer depuis l'API
    try {
      console.log(`🔄 Fetching data pour: ${key}`);
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`❌ Erreur fetching ${key}:`, error);
      throw error;
    }
  }

  /**
   * Obtenir la clé de cache normalisée
   */
  private getCacheKey(key: string): string {
    return key.toUpperCase();
  }

  /**
   * Obtenir le TTL par défaut selon le type de donnée
   */
  private getTTL(key: string): number {
    const upperKey = key.toUpperCase();
    
    switch (upperKey) {
      case 'ROLES':
        return this.TTL.ROLES;
      case 'GENRES':
        return this.TTL.GENRES;
      case 'POSTES':
        return this.TTL.POSTES;
      case 'TYPE_MATERIEL':
        return this.TTL.TYPE_MATERIEL;
      case 'LANGUAGES':
        return this.TTL.LANGUAGES;
      default:
        return 60 * 60 * 1000; // 1 heure par défaut
    }
  }

  /**
   * Obtenir les statistiques du cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton
export const cacheService = new CacheService();

// Hook React pour utiliser le cache
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await cacheService.getOrSet(key, fetcher, ttl);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key]);

  return { data, loading, error, refetch: fetchData };
}
