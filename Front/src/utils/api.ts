import { normalizeToArray } from './normalizeApiResponse';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY || '';

export const API_ENDPOINTS = {
  // Films
  FILMS: '/api/films',
  FILM: (id: string | number) => `/api/films/${id}`,
  
  // Séries
  SERIES: '/api/series',
  SERIE: (id: string | number) => `/api/series/${id}`,
  SERIE_SEASONS: (id: string | number) => `/api/series/${id}/seasons`,
  
  // Saisons
  SEASONS: '/api/seasons',
  SEASON: (id: string | number) => `/api/seasons/${id}`,
  SEASON_EPISODES: (id: string | number) => `/api/seasons/${id}/episodes`,
  
  // Épisodes
  EPISODES: '/api/episodes',
  EPISODE: (id: string | number) => `/api/episodes/${id}`,
  
  // Personnes
  PERSONNES: '/api/personnes',
  PERSONNE: (id: string | number) => `/api/personnes/${id}`,
  
  // Participations
  PARTICIPATIONS: '/api/participations',
  PARTICIPATION: (id: string | number) => `/api/participations/${id}`,
  PARTICIPATION_BY_FILM: (filmId: string | number) => `/api/participations/film/${filmId}`,
  PARTICIPATION_BY_SERIE: (serieId: string | number) => `/api/participations/serie/${serieId}`,
  PARTICIPATIONS_MINIMAL: '/api/participations/minimal',
  
  // Soustitres
  SOUSTITRES: '/api/soustitres',
  SOUSTITRE: (id: string | number) => `/api/soustitres/${id}`,
  SOUSTITRE_BY_FILM: (filmId: string | number) => `/api/soustitres/film/${filmId}`,
  SOUSTITRE_BY_SERIE: (serieId: string | number) => `/api/soustitres/serie/${serieId}`,
  SOUSTITRE_BY_EPISODE: (episodeId: string | number) => `/api/soustitres/episode/${episodeId}`,
  
  // Matériel
  MATERIELS: '/api/materiels',
  MATERIEL: (id: string | number) => `/api/materiels/${id}`,
  MATERIEL_IMPORT_CSV: '/api/materiels/import/csv',
  MATERIEL_IMPORT_TEMPLATE: '/api/materiels/import/template',
  TYPE_MATERIEL: '/api/type-materiel',
  
  // Validations
  VALIDATIONS: '/api/validations',
  VALIDATION: (id: string | number) => `/api/validations/${id}`,
  VALIDATION_PENDING: '/api/validations/pending',
  VALIDATION_APPROVE: (id: string | number) => `/api/validations/${id}/approve`,
  VALIDATION_REJECT: (id: string | number) => `/api/validations/${id}/reject`,
  
  // Auth - Rôles
  AUTH_ROLES: '/api/auth/roles',
  
  // Genres
  GENRES: '/api/genres',
  GENRE: (id: string | number) => `/api/genres/${id}`,
  
  // Users
  USERS: '/api/users',
  USER: (id: string | number) => `/api/users/${id}`,
  
  // Langues
  LANGUES: '/api/languages',
  LANGUE: (id: string | number) => `/api/languages/${id}`,
  LANGUAGES: '/api/languages',
  LANGUAGE: (id: string | number) => `/api/languages/${id}`,
  
  // Postes
  POSTES: '/api/postes',
  
  // Dashboard
  DASHBOARD_STATS: '/api/series/dashboard/stats',
  DASHBOARD_EXPORT_PDF: '/api/series/dashboard/export/pdf',
  
  // Carrousels
  CARROUSELS: '/api/carrousels',
  CARROUSEL: (id: string | number) => `/api/carrousels/${id}`,
  CARROUSELS_PUBLIC: '/api/carrousels/public',
  
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VERIFY_CODE: '/api/auth/verify-code',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
};

interface RequestOptions extends RequestInit {
    data?: any;
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = new Headers(options.headers || {});
    headers.set('x-api-key', API_KEY);

    // Add authentication token if available
    const token = localStorage.getItem('access_token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.data && !(options.data instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
        options.body = JSON.stringify(options.data);
    } else if (options.data instanceof FormData) {
        options.body = options.data;
    }

    console.log(`[API] Request: ${options.method || 'GET'} ${url}`, options.data);

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[API] Error response from ${url}:`, errorData);
            throw new Error(errorData.message || `API Error: ${response.statusText} (${response.status})`);
        }

        const data = await (async () => {
            if (response.status === 204) return null;

            const contentType = response.headers.get('Content-Type');
            if (contentType && (contentType.includes('application/pdf') || contentType.includes('text/csv'))) {
                return response.blob();
            }

            return response.json();
        })();

        console.log(`[API] Success: ${options.method || 'GET'} ${url}`, data);
        return data;

    } catch (error: any) {
        console.error(`[API] Network Error or Exception for ${url}:`, error);
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error(`Le serveur API est injoignable (${API_URL}). Vérifiez qu'il est bien démarré.`);
        }
        throw error;
    }
}

// ===== FONCTIONS DE NORMALISATION =====

/**
 * Fonctions spécifiques avec normalisation intégrée
 */
export async function getParticipationsMinimal(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.PARTICIPATIONS_MINIMAL, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getContenus(params?: any): Promise<any[]> {
    const response = await apiRequest('/api/contenu', { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getPersonnes(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.PERSONNES, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getPostes(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.POSTES, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getMateriels(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.MATERIELS, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

// ===== CORE LISTS - PHASE 1 =====

export async function getFilms(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.FILMS, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getSeries(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.SERIES, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getValidations(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.VALIDATIONS, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getCarrousels(params?: any): Promise<any[]> {
    const response = await apiRequest(API_ENDPOINTS.CARROUSELS, { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

// ===== PRODUCTION LISTS - PHASE 2 =====

export async function getMaterialUsed(params?: any): Promise<any[]> {
    const response = await apiRequest('/api/materiel-utilise/minimal', { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getSubtitling(params?: any): Promise<any[]> {
    const response = await apiRequest('/api/soustitres/liste-simple', { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

// ===== SECONDARY LISTS - PHASE 3 =====

export async function getSaisons(params?: any): Promise<any[]> {
    const response = await apiRequest('/api/seasons', { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}

export async function getEpisodes(params?: any): Promise<any[]> {
    const response = await apiRequest('/api/episodes', { 
        method: 'GET',
        ...params 
    });
    return normalizeToArray(response);
}
