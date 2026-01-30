/**
 * Mapper pour convertir les données films du backend vers le format frontend
 */

export interface BackendFilm {
  id_film: number;
  id_contenu: number;
  titre: string;
  synopsis?: string;
  date_sortie: string;
  sous_titre?: string;
  statut: string;
  duree: string;
  type_film: string;
  mux_asset_id?: string;
  mux_playback_id: string;
  miniature?: string;
  genres?: Array<{id_genre: number, nom_genre: string}>; // Format JSON du backend
  // Champs additionnels du backend
  realisateur?: string;
  acteurs?: string;
  pays?: string;
  langue?: string;
  classification?: string;
}

export interface FrontendMovie {
  id: string;
  title: string;
  titre?: string; // Ajout pour compatibilité avec FilmsList.tsx
  description: string;
  thumbnail: string;
  duration: string;
  year: number;
  genre: string;
  rating: string;
  score?: number;
  featured?: boolean;
  releaseYear?: number;
  director?: string;
  // Nouveaux champs pour affichage complet
  realisateur?: string;
  acteurs?: string;
  pays?: string;
  langue?: string;
  classification?: string;
  // Champs supplémentaires pour compatibilité avec base.ts
  id_film: number;
  id_contenu: number;
  synopsis?: string;
  date_sortie: string;
  date_ajout: string;
  sous_titre?: string;
  est_serie: boolean;
  statut: string;
  type_film: string;
  // Ajout pour compatibilité avec le tri
  date?: string;
  mux_asset_id?: string;
  mux_playback_id: string;
  mux_status: string;
  mux_poster_url?: string;
  miniature?: string;
  genres?: string[];
}

/**
 * Convertit un film du backend vers le format frontend
 */
export function mapBackendFilmToFrontend(backendFilm: BackendFilm): FrontendMovie {
  const year = new Date(backendFilm.date_sortie).getFullYear();
  
  // Convertir les genres du format JSON vers string array
  const genresArray = backendFilm.genres?.map(g => g.nom_genre) || [];
  
  return {
    // Frontend format
    id: backendFilm.id_film.toString(),
    title: backendFilm.titre,
    titre: backendFilm.titre, // Ajout pour compatibilité avec FilmsList.tsx
    description: backendFilm.synopsis || '',
    thumbnail: backendFilm.miniature || '',
    duration: backendFilm.duree,
    year,
    genre: genresArray.join(', ') || '',
    rating: backendFilm.classification || 'PG-13',
    score: undefined,
    featured: false,
    releaseYear: year,
    director: backendFilm.realisateur,
    
    // Nouveaux champs pour affichage complet
    realisateur: backendFilm.realisateur,
    acteurs: backendFilm.acteurs,
    pays: backendFilm.pays,
    langue: backendFilm.langue,
    classification: backendFilm.classification,
    
    // Champs backend pour compatibilité
    id_film: backendFilm.id_film,
    id_contenu: backendFilm.id_contenu,
    synopsis: backendFilm.synopsis,
    date_sortie: backendFilm.date_sortie,
    date_ajout: '', // Champ non fourni par le backend
    sous_titre: backendFilm.sous_titre,
    est_serie: false, // Ce sont des films, pas des séries
    statut: backendFilm.statut,
    type_film: backendFilm.type_film,
    mux_asset_id: backendFilm.mux_asset_id,
    mux_playback_id: backendFilm.mux_playback_id,
    mux_status: '', // Champ non fourni par le backend
    miniature: backendFilm.miniature,
    genres: genresArray,
    // Ajout pour compatibilité avec le tri
    date: backendFilm.date_sortie,
  };
}

/**
 * Convertit une liste de films du backend vers le format frontend
 */
export function mapBackendFilmsToFrontend(backendFilms: BackendFilm[]): FrontendMovie[] {
  return backendFilms.map(mapBackendFilmToFrontend);
}
