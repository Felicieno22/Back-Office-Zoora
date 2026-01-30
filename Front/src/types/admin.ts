/**
 * Types pour les entités manquantes
 * Utilisateur, Role, Soustitrage, Personne, Poste, Participation, Materiel
 */

// ============ UTILISATEUR & AUTH ============

export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  email: string;
  mot_de_passe?: string;                    // Pas envoyé au frontend
  date_naissance: string;                    // YYYY-MM-DD
  date_inscription: string;                  // TIMESTAMPTZ
  est_actif: boolean;
  tentatives_echouees: number;
  verrouille_jusqua?: string;               // TIMESTAMPTZ
  roles?: Role[];
}

export interface Role {
  id_role: number;
  nom: string;                               // VARCHAR(50)
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UtilisateurRole {
  id_utilisateur: number;
  id_role: number;
  date_attribution: string;
}

// ============ SOUSTITRAGE ============

export interface Soustitrage {
  id_soustitrage: number;
  id_contenu?: number;                       // FK Contenu (nullable)
  id_episode?: number;                       // FK Episode (nullable)
  langue: string;                            // CHAR(5) ex: 'fr_FR'
  url_fichier: string;                       // VARCHAR(500)
  est_force: boolean;                        // DEFAULT FALSE
  date_ajout: string;                        // TIMESTAMPTZ
}

export interface SoustitrageFormData {
  langue: string;
  url_fichier: string;
  est_force: boolean;
}

// ============ PERSONNE (Acteur, Réalisateur, etc) ============

export interface Personne {
  id_personne: number;
  nom: string;                               // VARCHAR(150) NOT NULL
  prenom?: string;                           // VARCHAR(150)
  email?: string;                            // VARCHAR(150) UNIQUE
  telephone?: string;                        // VARCHAR(30) UNIQUE
  date_naissance?: string;                   // YYYY-MM-DD
  biographie?: string;                       // VARCHAR(500)
}

export interface PersonneFormData {
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  date_naissance?: string;
  biographie?: string;
}

// ============ POSTE (Directeur, Acteur, Producteur, etc) ============

export interface Poste {
  id_poste: number;
  nom: string;                               // VARCHAR(100) UNIQUE
  code: string;                              // VARCHAR(50) UNIQUE
}

export const POSTES: Array<{ value: string; label: string }> = [
  { value: 'directeur', label: 'Directeur/Réalisateur' },
  { value: 'producteur', label: 'Producteur' },
  { value: 'acteur', label: 'Acteur' },
  { value: 'cameraman', label: 'Cameraman' },
  { value: 'son', label: 'Ingénieur Son' },
  { value: 'montage', label: 'Monteur' },
  { value: 'musique', label: 'Compositeur' },
  { value: 'scenariste', label: 'Scénariste' },
  { value: 'directeur_photo', label: 'Directeur Photo' }
];

// ============ PARTICIPATION (Équipage sur un Contenu) ============

export interface Participation {
  id_contenu: number;
  id_personne: number;
  id_poste: number;
  detail_fonction?: string;                  // VARCHAR(200)
  ordre_affichage: number;                   // SMALLINT DEFAULT 999
  personne?: Personne;                       // Join pour affichage
  poste?: Poste;                             // Join pour affichage
}

export interface ParticipationFormData {
  id_personne: number;
  id_poste: number;
  detail_fonction?: string;
  ordre_affichage?: number;
}

// ============ TYPE MATERIEL ============

export interface TypeMateriel {
  id_type: number;
  nom: string;                               // VARCHAR(100) UNIQUE
  code?: string;                             // VARCHAR(50) UNIQUE
}

export const TYPES_MATERIEL: Array<{ value: string; label: string }> = [
  { value: 'camera', label: 'Caméra' },
  { value: 'objectif', label: 'Objectif' },
  { value: 'drone', label: 'Drone' },
  { value: 'eclairage', label: 'Éclairage' },
  { value: 'micro', label: 'Microphone' },
  { value: 'mixette', label: 'Mixette' },
  { value: 'trepied', label: 'Trépied' },
  { value: 'girafe', label: 'Girafe' },
  { value: 'batterie', label: 'Batterie' },
  { value: 'autre', label: 'Autre' }
];

export type EtatMateriel = 'operationnel' | 'en-maintenance' | 'hs' | 'perdu';

export const ETATS_MATERIEL: Array<{ value: EtatMateriel; label: string; color: string }> = [
  { value: 'operationnel', label: 'Opérationnel', color: 'bg-green-100 text-green-800' },
  { value: 'en-maintenance', label: 'En maintenance', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hs', label: 'Hors service', color: 'bg-red-100 text-red-800' },
  { value: 'perdu', label: 'Perdu', color: 'bg-gray-100 text-gray-800' }
];

// ============ MATERIEL ============

export interface Materiel {
  id_materiel: number;
  id_type: number;
  nom: string;                               // VARCHAR(200) NOT NULL
  marque: string;                            // VARCHAR(100) NOT NULL
  modele?: string;                           // VARCHAR(100)
  numero_serie: string;                      // VARCHAR(100) UNIQUE NOT NULL
  etat: EtatMateriel;                        // DEFAULT 'operationnel'
  date_achat?: string;                       // YYYY-MM-DD
  type_materiel?: TypeMateriel;              // Join pour affichage
}

export interface MaterielFormData {
  id_type: number;
  nom: string;
  marque: string;
  modele?: string;
  numero_serie: string;
  etat: EtatMateriel;
  date_achat?: string;
}

// ============ MATERIEL UTILISE ============

export interface MaterielUtilise {
  id_contenu: number;
  id_materiel: number;
  id_personne: number;
  date_debut: string;                        // TIMESTAMPTZ
  date_fin?: string;                         // TIMESTAMPTZ
  notes?: string;                            // TEXT
  materiel?: Materiel;
  personne?: Personne;
}

// ============ LOGS ACTIVITE ============

export interface LogActivite {
  id_log: number;
  id_utilisateur?: number;
  action: string;                            // VARCHAR(100) NOT NULL
  details?: string;                          // TEXT
  date_log: string;                          // TIMESTAMPTZ
  utilisateur?: Utilisateur;
}

// ============ VALIDATION ADMIN ============

export interface ValidationAdmin {
  id_validation: number;
  type_cible: string;                        // VARCHAR(50) - type d'objet
  id_cible: number;                          // INTEGER
  id_utilisateur?: number;
  donnees_proposees: string;                 // JSON en TEXT
  statut: 'en_attente' | 'approuve' | 'rejete' | 'supprime';
  date_creation: string;                     // TIMESTAMPTZ
  utilisateur?: Utilisateur;
  donnees_parsees?: any;                     // Parsed JSON
}

// ============ COMPONENT PROPS ============

export interface ParticipationListProps {
  contentId: number;
  participations: Participation[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (p: Participation) => void;
  onDelete?: (contentId: number, personneId: number, posteId: number) => void;
  isDarkMode?: boolean;
}

export interface MaterielListProps {
  materials: Materiel[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (m: Materiel) => void;
  onDelete?: (materielId: number) => void;
  isDarkMode?: boolean;
}

export interface SoustitrageListProps {
  contentId?: number;
  episodeId?: number;
  subtitles: Soustitrage[];
  isLoading?: boolean;
  onAdd?: () => void;
  onDelete?: (soustitreId: number) => void;
  isDarkMode?: boolean;
}
