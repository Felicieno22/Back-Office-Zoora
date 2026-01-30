/**
 * Types de base pour Contenu, Film, Série, Saison, Episode
 * Alignés avec la structure BDD
 */

// ============ CONTENU (Table parent) ============
export interface Contenu {
  id_contenu: number;
  titre: string;
  synopsis?: string;
  date_sortie: string; // YYYY-MM-DD
  date_ajout: string; // Timestamp
  sous_titre?: string;
  est_serie: boolean;
  statut: ContentStatus;
  genres?: string[]; // Récupérés via GenreContenu
}

// ============ FILM ============
export interface Film extends Contenu {
  id_film: number;
  type_film: TypeFilm;
  mux_asset_id?: string;
  mux_playback_id: string;
  mux_status: MuxStatus;
  mux_poster_url?: string;
  duree: string; // HH:mm:ss
  miniature?: string;
}

// ============ SERIE ============
export interface Serie extends Contenu {
  id_serie: number;
  miniature?: string;
  saisons?: Saison[];
}

// ============ SAISON ============
export interface Saison {
  id_saison: number;
  id_serie: number;
  numero_saison: number;
  titre?: string;
  synopsis?: string;
  miniature?: string;
  date_sortie?: string; // YYYY-MM-DD
  statut: ContentStatus;
  episodes?: Episode[];
}

// ============ EPISODE ============
export interface Episode {
  id_episode: number;
  id_saison: number;
  numero_episode: number;
  titre: string;
  synopsis?: string;
  duree: string; // HH:mm:ss
  mux_asset_id?: string;
  mux_playback_id: string;
  mux_status: MuxStatus;
  mux_poster_url?: string;
  date_sortie?: string; // YYYY-MM-DD
  statut: ContentStatus;
}

// ============ ENUMS & UNIONS ============

/** Statut du contenu (Contenu, Saison, Episode) */
export type ContentStatus = 'en_attente' | 'approuve' | 'rejete' | 'supprime';

/** Type de film */
export type TypeFilm = 'long-metrage' | 'court-metrage' | 'moyen-metrage';

/** Statut Mux (pour Film et Episode) */
export type MuxStatus = 'preparing' | 'ready' | 'errored' | 'deleted';

// ============ FORM DATA ============

/**
 * Données de formulaire pour Saison
 * Utilisées par SeasonForm
 */
export interface SeasonFormData {
  id_serie: number;
  numero_saison: number;
  titre?: string;
  synopsis?: string;
  miniature?: string;
  date_sortie?: string;
  statut: ContentStatus;
}

/**
 * Données de formulaire pour Episode
 * Utilisées par EpisodeForm
 */
export interface EpisodeFormData {
  id_saison: number;
  numero_episode: number;
  titre: string;
  synopsis?: string;
  duree: string;
  mux_asset_id?: string;
  mux_playback_id: string;
  mux_status: MuxStatus;
  mux_poster_url?: string;
  date_sortie?: string;
  statut: ContentStatus;
}

// ============ API RESPONSES ============

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============ COMPONENT PROPS ============

/**
 * Props pour FilmCard
 * Single Responsibility: Afficher une carte Film
 */
export interface FilmCardProps {
  film: Film;
  isDarkMode?: boolean;
  onEdit?: (film: Film) => void;
  onDelete?: (filmId: number) => void;
  onSelect?: (film: Film) => void;
}

/**
 * Props pour SerieCard
 * Single Responsibility: Afficher une carte Série
 */
export interface SerieCardProps {
  serie: Serie;
  isDarkMode?: boolean;
  onEdit?: (serie: Serie) => void;
  onDelete?: (serieId: number) => void;
  onSelect?: (serie: Serie) => void;
  onAddSeason?: (serieId: number) => void;
}

/**
 * Props pour SeasonForm (Dialog/Modal)
 * Single Responsibility: Formulaire de création Saison
 */
export interface SeasonFormProps {
  serieId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (season: Saison) => void;
  onError?: (error: string) => void;
  isDarkMode?: boolean;
}

/**
 * Props pour SeasonList (Intégré dans SerieDetails)
 * Single Responsibility: Lister les saisons d'une série
 */
export interface SeasonListProps {
  serieId: number;
  seasons: Saison[];
  isLoading?: boolean;
  onAddEpisode?: (seasonId: number) => void;
  onRefresh?: () => void;
  isDarkMode?: boolean;
}

/**
 * Props pour EpisodeForm (Dialog/Modal)
 * Single Responsibility: Formulaire de création Episode
 */
export interface EpisodeFormProps {
  seasonId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (episode: Episode) => void;
  onError?: (error: string) => void;
  isDarkMode?: boolean;
}

/**
 * Props pour EpisodeList (Intégré dans SeasonList)
 * Single Responsibility: Lister les episodes d'une saison
 */
export interface EpisodeListProps {
  seasonId: number;
  episodes: Episode[];
  isLoading?: boolean;
  onRefresh?: () => void;
  isDarkMode?: boolean;
}
