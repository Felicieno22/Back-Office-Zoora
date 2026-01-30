/**
 * Constants de base
 * Single Source of Truth pour les valeurs statiques
 * Respecte DRY principle: une seule définition
 */

import { ContentStatus, TypeFilm, MuxStatus } from '../types/base';

// ============ GENRES ============
export const GENRES = [
  'Action',
  'Aventure',
  'Comédie',
  'Drame',
  'Fantastique',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Suspense',
  'Thriller',
  'Autre'
];

// ============ TYPES DE FILM ============
export const FILM_TYPES: Array<{ value: TypeFilm; label: string }> = [
  { value: 'long-metrage', label: 'Long-métrage' },
  { value: 'court-metrage', label: 'Court-métrage' },
  { value: 'moyen-metrage', label: 'Moyen-métrage' }
];

// ============ STATUTS CONTENU ============
export const CONTENT_STATUS_OPTIONS: Array<{ value: ContentStatus; label: string; color: string }> = [
  { value: 'en_attente', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approuve', label: 'Approuvé', color: 'bg-green-100 text-green-800' },
  { value: 'rejete', label: 'Rejeté', color: 'bg-red-100 text-red-800' },
  { value: 'supprime', label: 'Supprimé', color: 'bg-gray-100 text-gray-800' }
];

// ============ STATUTS MUX ============
export const MUX_STATUS_OPTIONS: Array<{ value: MuxStatus; label: string; color: string }> = [
  { value: 'preparing', label: 'En préparation', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready', label: 'Prêt', color: 'bg-green-100 text-green-800' },
  { value: 'errored', label: 'Erreur', color: 'bg-red-100 text-red-800' },
  { value: 'deleted', label: 'Supprimé', color: 'bg-gray-100 text-gray-800' }
];

// ============ DEFAULT VALUES ============
export const DEFAULT_THUMBNAIL = 'https://via.placeholder.com/300x400?text=No+Image';

export const DEFAULT_POSTER_URL = 'https://via.placeholder.com/1920x1080?text=No+Poster';

// ============ MESSAGES DE VALIDATION ============
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Le titre est obligatoire',
  TITLE_MIN_LENGTH: 'Le titre doit contenir au moins 2 caractères',
  GENRE_REQUIRED: 'Le genre est obligatoire',
  RELEASE_DATE_REQUIRED: 'La date de sortie est obligatoire',
  SYNOPSIS_REQUIRED: 'Le synopsis est obligatoire',
  DURATION_REQUIRED: 'La durée est obligatoire',
  MUX_PLAYBACK_ID_REQUIRED: 'L\'ID de lecture Mux est obligatoire',
  
  SEASON_NUMBER_REQUIRED: 'Le numéro de saison est obligatoire',
  SEASON_NUMBER_MIN: 'Le numéro de saison doit être > 0',
  
  EPISODE_NUMBER_REQUIRED: 'Le numéro d\'épisode est obligatoire',
  EPISODE_NUMBER_MIN: 'Le numéro d\'épisode doit être > 0'
};

// ============ API ENDPOINTS ============
export const API_ENDPOINTS = {
  FILMS: '/api/films',
  SERIES: '/api/series',
  SEASONS: '/api/seasons',
  EPISODES: '/api/episodes',
  GENRES: '/api/genres'
};

// ============ PAGINATION ============
export const PAGINATION_LIMIT = 10;

// ============ TIMEOUT VALUES ============
export const API_TIMEOUT = 30000; // 30 secondes
