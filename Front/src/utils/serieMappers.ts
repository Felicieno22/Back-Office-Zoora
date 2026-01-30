/**
 * Mapper pour convertir les données séries du backend vers le format frontend
 */

export interface BackendSerie {
  id_serie: number;
  id_contenu: number;
  titre: string;
  synopsis?: string;
  date_sortie: string;
  date_ajout: string;
  sous_titre?: string;
  est_serie: boolean;
  statut: string;
  miniature?: string;
  genres?: string[];
  saisons?: any[];
  // Nouveaux champs du backend
  createur?: string;
  acteurs?: string;
  pays?: string;
  langue?: string;
  classification?: string;
  nbSaisons?: number;
  nbEpisodes?: number;
}

export interface FrontendSerie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  year: number;
  genre: string;
  rating: string;
  score?: number;
  featured?: boolean;
  releaseYear?: number;
  director?: string;
  numberOfSeasons?: number;
  // Nouveaux champs pour affichage complet
  createur?: string;
  acteurs?: string;
  pays?: string;
  langue?: string;
  classification?: string;
  nbSaisons?: number;
  nbEpisodes?: number;
  // Champs supplémentaires pour compatibilité avec base.ts
  id_serie: number;
  id_contenu: number;
  synopsis?: string;
  date_sortie: string;
  date_ajout: string;
  sous_titre?: string;
  est_serie: boolean;
  statut: string;
  miniature?: string;
  genres?: string[];
  saisons?: any[];
}

/**
 * Convertit une série du backend vers le format frontend
 */
export function mapBackendSerieToFrontend(backendSerie: BackendSerie): FrontendSerie {
  const year = new Date(backendSerie.date_sortie).getFullYear();
  
  return {
    // Frontend format
    id: backendSerie.id_serie.toString(),
    title: backendSerie.titre,
    description: backendSerie.synopsis || '',
    thumbnail: backendSerie.miniature || '',
    year,
    genre: backendSerie.genres?.join(', ') || '',
    rating: backendSerie.classification || 'PG-13',
    score: undefined,
    featured: false,
    releaseYear: year,
    director: backendSerie.createur,
    numberOfSeasons: backendSerie.saisons?.length,
    
    // Nouveaux champs pour affichage complet
    createur: backendSerie.createur,
    acteurs: backendSerie.acteurs,
    pays: backendSerie.pays,
    langue: backendSerie.langue,
    classification: backendSerie.classification,
    nbSaisons: backendSerie.nbSaisons,
    nbEpisodes: backendSerie.nbEpisodes,
    
    // Champs backend pour compatibilité
    id_serie: backendSerie.id_serie,
    id_contenu: backendSerie.id_contenu,
    synopsis: backendSerie.synopsis,
    date_sortie: backendSerie.date_sortie,
    date_ajout: backendSerie.date_ajout,
    sous_titre: backendSerie.sous_titre,
    est_serie: backendSerie.est_serie,
    statut: backendSerie.statut,
    miniature: backendSerie.miniature,
    genres: backendSerie.genres,
    saisons: backendSerie.saisons,
  };
}

/**
 * Convertit une liste de séries du backend vers le format frontend
 */
export function mapBackendSeriesToFrontend(backendSeries: BackendSerie[]): FrontendSerie[] {
  return backendSeries.map(mapBackendSerieToFrontend);
}
