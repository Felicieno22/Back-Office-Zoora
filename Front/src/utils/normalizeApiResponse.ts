/**
 * 🎯 UTILITAIRE CENTRALISÉ DE NORMALISATION API
 * 
 * Règle 4: Une seule fonction de normalisation par projet
 * Impact: ★★★★★ - Centralise la logique → facile à corriger quand le backend change
 */

export function normalizeToArray<T = any>(data: unknown): T[] {
  // Cas 1: Déjà un tableau
  if (Array.isArray(data)) return data as T[];

  // Cas 2: Objet avec propriétés contenant un tableau
  if (data && typeof data === 'object' && data !== null) {
    // Ordre de priorité des clés les plus probables dans ZOORA
    const candidates = [
      (data as any).data,           // Réponse standard API
      (data as any).contenus,       // Contenus
      (data as any).participations, // Participations
      (data as any).films,          // Films
      (data as any).series,         // Séries
      (data as any).episodes,       // Épisodes
      (data as any).saisons,         // Saisons
      (data as any).materiels,      // Matériels
      (data as any).personnes,      // Personnes
      (data as any).postes,         // Postes
      (data as any).carrousels,      // Carrousels
      (data as any).validations,    // Validations
      (data as any).soustitres,     // Sous-titres
      (data as any).results,        // Résultats génériques
      (data as any).items,          // Items génériques
      (data as any).list,           // List générique
      (data as any).content,        // Content générique
      (data as any).records,        // Records générique
      (data as any).rows,           // Rows générique
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate as T[];
    }
  }

  // Cas 3: Développement - alerte en cas de format inattendu
  if (process.env.NODE_ENV === 'development' && data) {
    console.warn(
      '⚠️ [normalizeToArray] Format de réponse inattendu - fallback []',
      { 
        received: data,
        type: typeof data,
        constructor: data?.constructor?.name
      }
    );
  }

  // Cas 4: Fallback sécurisé
  return [];
}

/**
 * 🎯 Normalisation avec typage fort pour les listes dropdown
 */
export function normalizeToOptions<T extends { id?: number | string; id_contenu?: number | string }>(
  data: unknown,
  labelField: keyof T = 'titre' as keyof T
): Array<{ value: string; label: string }> {
  const items = normalizeToArray<T>(data);
  
  return items.map(item => ({
    value: String(item.id ?? item.id_contenu ?? ''),
    label: String((item as any)[labelField] || (item as any).nom || 'Sans nom')
  }));
}

/**
 * 🎯 Interface pour les réponses API standardisées
 */
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

/**
 * 🎯 Extracteur de données depuis les réponses API
 */
export function extractData<T>(response: ApiResponse<T> | unknown): T[] {
  // Si c'est une réponse API standard
  if (response && typeof response === 'object' && 'data' in response) {
    return normalizeToArray<T>((response as ApiResponse<T>).data);
  }
  
  // Sinon, traiter comme une réponse brute
  return normalizeToArray<T>(response);
}
