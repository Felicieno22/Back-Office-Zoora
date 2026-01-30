import { useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../utils/api';
import { cacheService } from '../utils/cacheService';

// Interfaces pour les données
export interface Role {
  idRole: number;
  nom: string;
  descript?: string;
}

export interface Genre {
  idGenre: number;
  nom: string;
}

export interface Poste {
  idPoste: number;
  nom: string;
  code: string;
}

export interface TypeMateriel {
  idType: number;
  nom: string;
  code?: string;
}

export interface Language {
  idLanguage: number;
  nom: string;
  code: string;
}

export interface Serie {
  idSerie: number;
  idContenu: number;
  titre: string;
  miniature?: string;
}

export interface Saison {
  idSaison: number;
  idSerie: number;
  numeroSaison: number;
  titre?: string;
}

export interface Episode {
  idEpisode: number;
  idSaison: number;
  numeroEpisode: number;
  titre: string;
}

// Service de données pour les listes déroulantes
export class DropdownDataService {
  
  // ========== DONNÉES EN CACHE (CONSTANTES) ==========
  
  /**
   * Récupérer les rôles (cache 24h)
   */
  async getRoles(): Promise<Role[]> {
    return cacheService.getOrSet('ROLES', async () => {
      const response = await apiRequest(API_ENDPOINTS.AUTH_ROLES);
      return response.data || [];
    });
  }

  /**
   * Récupérer les genres (cache 24h)
   */
  async getGenres(): Promise<Genre[]> {
    return cacheService.getOrSet('GENRES', async () => {
      const response = await apiRequest(API_ENDPOINTS.GENRES);
      return response || [];
    });
  }

  /**
   * Récupérer les postes (cache 24h)
   */
  async getPostes(): Promise<Poste[]> {
    return cacheService.getOrSet('POSTES', async () => {
      const response = await apiRequest(API_ENDPOINTS.POSTES);
      return response || [];
    });
  }

  /**
   * Récupérer les types de matériel (cache 24h)
   */
  async getTypesMateriel(): Promise<TypeMateriel[]> {
    return cacheService.getOrSet('TYPE_MATERIEL', async () => {
      const response = await apiRequest(API_ENDPOINTS.TYPE_MATERIEL);
      return response || [];
    });
  }

  /**
   * Récupérer les langues (cache 24h)
   */
  async getLanguages(): Promise<Language[]> {
    return cacheService.getOrSet('LANGUAGES', async () => {
      const response = await apiRequest(API_ENDPOINTS.LANGUAGES);
      return response || [];
    });
  }

  // ========== DONNÉES DYNAMIQUES (SANS CACHE) ==========
  
  /**
   * Récupérer les séries (sans cache - données changeantes)
   */
  async getSeries(): Promise<Serie[]> {
    try {
      const response = await apiRequest(API_ENDPOINTS.SERIES);
      return response || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des séries:', error);
      return [];
    }
  }

  /**
   * Récupérer les saisons d'une série (sans cache)
   */
  async getSaisonsBySerie(idSerie: number): Promise<Saison[]> {
    try {
      const response = await apiRequest(API_ENDPOINTS.SERIE_SEASONS(idSerie));
      return response || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des saisons pour la série ${idSerie}:`, error);
      return [];
    }
  }

  /**
   * Récupérer les épisodes d'une saison (sans cache)
   */
  async getEpisodesBySaison(idSaison: number): Promise<Episode[]> {
    try {
      const response = await apiRequest(API_ENDPOINTS.SEASON_EPISODES(idSaison));
      return response || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des épisodes pour la saison ${idSaison}:`, error);
      return [];
    }
  }

  // ========== UTILITAIRES ==========
  
  /**
   * Invalider le cache pour une clé spécifique
   */
  invalidateCache(key: string): void {
    cacheService.invalidate(key);
  }

  /**
   * Vider tout le cache
   */
  clearCache(): void {
    cacheService.clear();
  }

  /**
   * Obtenir les statistiques du cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return cacheService.getStats();
  }

  /**
   * Précharger toutes les données constantes au démarrage
   */
  async preloadConstantData(): Promise<void> {
    console.log('🔄 Préchargement des données constantes...');
    
    try {
      await Promise.all([
        this.getRoles(),
        this.getGenres(),
        this.getPostes(),
        this.getTypesMateriel(),
        this.getLanguages()
      ]);
      
      console.log('✅ Données constantes préchargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du préchargement des données constantes:', error);
    }
  }
}

// Export singleton
export const dropdownDataService = new DropdownDataService();

// Hook React pour les données constantes (avec cache)
export function useConstantData<T>(
  fetcher: () => Promise<T[]>
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetcher]);

  return { data, loading, error };
}
