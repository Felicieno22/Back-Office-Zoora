/**
 * Error handling utilities for API calls
 * Handles various error scenarios gracefully
 */

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Error messages for different scenarios
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.',
  NOT_FOUND: 'Ressource non trouvée.',
  UNAUTHORIZED: 'Accès non autorisé. Veuillez vous reconnecter.',
  FORBIDDEN: 'Accès refusé.',
  TIMEOUT: 'La requête a expiré. Veuillez réessayer.',
  VALIDATION_ERROR: 'Données invalides. Veuillez vérifier les champs.',
  UNKNOWN_ERROR: 'Une erreur inconnue est survenue.',
  NO_DATA: 'Aucune donnée disponible pour le moment.',
  EMPTY_RESPONSE: 'Aucun résultat trouvé.'
};

// Check if response is valid
export const isValidResponse = (data: any): boolean => {
  if (data === null || data === undefined) return false;
  if (Array.isArray(data) && data.length === 0) return false;
  if (typeof data === 'object' && Object.keys(data).length === 0) return false;
  return true;
};

// Handle API errors gracefully
export const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);

  // Network error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR'
    };
  }

  // Timeout error
  if (error.name === 'AbortError') {
    return {
      message: ERROR_MESSAGES.TIMEOUT,
      code: 'TIMEOUT'
    };
  }

  // HTTP errors
  if (error.status) {
    switch (error.status) {
      case 400:
        return {
          message: error.message || ERROR_MESSAGES.VALIDATION_ERROR,
          status: 400,
          code: 'BAD_REQUEST'
        };
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status: 401,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: ERROR_MESSAGES.FORBIDDEN,
          status: 403,
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          status: 404,
          code: 'NOT_FOUND'
        };
      case 500:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          status: 500,
          code: 'SERVER_ERROR'
        };
      default:
        return {
          message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
          status: error.status,
          code: 'HTTP_ERROR'
        };
    }
  }

  // Default error
  return {
    message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    code: 'UNKNOWN'
  };
};

// Check if backend is reachable
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/api/health', { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Graceful data handling for components
export const handleDataResponse = <T>(
  data: any,
  fallback: T[] = []
): { data: T[]; hasData: boolean; isEmpty: boolean } => {
  if (!isValidResponse(data)) {
    return {
      data: fallback,
      hasData: false,
      isEmpty: true
    };
  }

  // Handle array responses
  if (Array.isArray(data)) {
    return {
      data: data as T[],
      hasData: data.length > 0,
      isEmpty: data.length === 0
    };
  }

  // Handle paginated responses
  if (data.data && Array.isArray(data.data)) {
    return {
      data: data.data as T[],
      hasData: data.data.length > 0,
      isEmpty: data.data.length === 0
    };
  }

  // Handle single object responses
  if (typeof data === 'object' && data !== null) {
    return {
      data: [data] as T[],
      hasData: true,
      isEmpty: false
    };
  }

  return {
    data: fallback,
    hasData: false,
    isEmpty: true
  };
};

// Error boundary component for React
// This should be implemented in a separate .tsx file