/**
 * Mappers: Transformation des données API
 * Single Responsibility: Convertir API → Frontend et Frontend → API
 * Respecte DRY: Une seule source de transformation
 */

import { Film, Serie, Saison, Episode, SeasonFormData, EpisodeFormData } from '../types/base';

// ============ API TO FRONTEND ============

/**
 * Transforme une réponse API Film vers le type Film
 * Gère les champs optionnels et conversions
 */
export const mapApiFilmToFilm = (apiData: any): Film => {
  return {
    id_contenu: apiData.id_contenu,
    id_film: apiData.id_film,
    titre: apiData.titre,
    synopsis: apiData.synopsis,
    date_sortie: apiData.date_sortie,
    date_ajout: apiData.date_ajout,
    sous_titre: apiData.sous_titre,
    est_serie: false,
    statut: apiData.statut,
    genres: apiData.genres || [],
    type_film: apiData.type_film,
    mux_asset_id: apiData.mux_asset_id,
    mux_playback_id: apiData.mux_playback_id,
    mux_status: apiData.mux_status,
    mux_poster_url: apiData.mux_poster_url,
    duree: apiData.duree,
    miniature: apiData.miniature
  };
};

/**
 * Transforme une réponse API Serie vers le type Serie
 */
export const mapApiSerieToSerie = (apiData: any): Serie => {
  return {
    id_contenu: apiData.id_contenu,
    id_serie: apiData.id_serie,
    titre: apiData.titre,
    synopsis: apiData.synopsis,
    date_sortie: apiData.date_sortie,
    date_ajout: apiData.date_ajout,
    sous_titre: apiData.sous_titre,
    est_serie: true,
    statut: apiData.statut,
    genres: apiData.genres || [],
    miniature: apiData.miniature,
    saisons: apiData.saisons ? apiData.saisons.map(mapApiSaisonToSaison) : []
  };
};

/**
 * Transforme une réponse API Saison vers le type Saison
 */
export const mapApiSaisonToSaison = (apiData: any): Saison => {
  return {
    id_saison: apiData.id_saison,
    id_serie: apiData.id_serie,
    numero_saison: apiData.numero_saison,
    titre: apiData.titre,
    synopsis: apiData.synopsis,
    miniature: apiData.miniature,
    date_sortie: apiData.date_sortie,
    statut: apiData.statut,
    episodes: apiData.episodes ? apiData.episodes.map(mapApiEpisodeToEpisode) : []
  };
};

/**
 * Transforme une réponse API Episode vers le type Episode
 */
export const mapApiEpisodeToEpisode = (apiData: any): Episode => {
  return {
    id_episode: apiData.id_episode,
    id_saison: apiData.id_saison,
    numero_episode: apiData.numero_episode,
    titre: apiData.titre,
    synopsis: apiData.synopsis,
    duree: apiData.duree,
    mux_asset_id: apiData.mux_asset_id,
    mux_playback_id: apiData.mux_playback_id,
    mux_status: apiData.mux_status,
    mux_poster_url: apiData.mux_poster_url,
    date_sortie: apiData.date_sortie,
    statut: apiData.statut
  };
};

// ============ FRONTEND TO API ============

/**
 * Formate les données du formulaire Saison pour l'API
 */
export const formatSeasonForApi = (formData: SeasonFormData): any => {
  return {
    id_serie: formData.id_serie,
    numero_saison: formData.numero_saison,
    titre: formData.titre || null,
    synopsis: formData.synopsis || null,
    miniature: formData.miniature || null,
    date_sortie: formData.date_sortie || null,
    statut: formData.statut
  };
};

/**
 * Formate les données du formulaire Episode pour l'API
 */
export const formatEpisodeForApi = (formData: EpisodeFormData): any => {
  return {
    id_saison: formData.id_saison,
    numero_episode: formData.numero_episode,
    titre: formData.titre,
    synopsis: formData.synopsis || null,
    duree: formData.duree,
    mux_asset_id: formData.mux_asset_id || null,
    mux_playback_id: formData.mux_playback_id,
    mux_status: formData.mux_status,
    mux_poster_url: formData.mux_poster_url || null,
    date_sortie: formData.date_sortie || null,
    statut: formData.statut
  };
};

// ============ UTILITY FUNCTIONS ============

/**
 * Extrait les genres uniques d'une liste de contenus
 */
export const extractGenres = (items: (Film | Serie)[]): string[] => {
  const genresSet = new Set<string>();
  items.forEach(item => {
    if (item.genres) {
      item.genres.forEach(genre => genresSet.add(genre));
    }
  });
  return Array.from(genresSet).sort();
};

/**
 * Filtre les contenus par terme de recherche
 */
export const filterContentBySearch = (
  items: (Film | Serie)[],
  searchTerm: string
): (Film | Serie)[] => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.titre.toLowerCase().includes(term) ||
    (item.synopsis?.toLowerCase().includes(term) ?? false)
  );
};

/**
 * Filtre les contenus par genre
 */
export const filterContentByGenre = (
  items: (Film | Serie)[],
  genre: string
): (Film | Serie)[] => {
  if (!genre) return items;
  
  return items.filter(item =>
    item.genres?.includes(genre) ?? false
  );
};

/**
 * Filtre les saisons par numéro
 */
export const filterSeasonsByNumber = (
  seasons: Saison[],
  seasonNumber: number
): Saison[] => {
  if (seasonNumber <= 0) return seasons;
  
  return seasons.filter(season => season.numero_saison === seasonNumber);
};

/**
 * Trie les episodes par numéro
 */
export const sortEpisodesByNumber = (episodes: Episode[]): Episode[] => {
  return [...episodes].sort((a, b) => a.numero_episode - b.numero_episode);
};

/**
 * Convertit une durée en format HH:mm:ss
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Convertit une durée HH:mm:ss en secondes
 */
export const parseDuration = (durationStr: string): number => {
  const parts = durationStr.split(':');
  if (parts.length !== 3) return 0;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};
