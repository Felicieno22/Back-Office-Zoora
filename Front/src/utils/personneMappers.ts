/**
 * Mapper pour convertir les données personnes/participations du backend vers le format frontend
 */

export interface BackendPersonne {
  id_personne: number;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  date_naissance?: string;
  biographie?: string;
}

export interface BackendParticipation {
  id_contenu: number;
  id_personne: number;
  id_poste: number;
  detail_fonction?: string;
  ordre_affichage?: number;
  // Jointures
  personne?: BackendPersonne;
  poste?: {
    id_poste: number;
    nom: string;
    code: string;
  };
  contenu?: {
    id_contenu: number;
    titre: string;
    est_serie: boolean;
  };
}

export interface FrontendPersonne {
  id: string;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  date_naissance?: string;
  biographie?: string;
  // Champs backend pour compatibilité
  id_personne: number;
}

export interface FrontendParticipation {
  id: string;
  idPersonne: string;
  idPoste: string;
  idFilm?: string;
  idSerie?: string;
  detail_fonction?: string;
  ordre_affichage?: number;
  // Champs étendus
  personne?: FrontendPersonne;
  poste?: {
    id: string;
    nom: string;
    code: string;
  };
  // Champs backend pour compatibilité
  id_contenu: number;
  id_personne: number;
  id_poste: number;
}

/**
 * Convertit une personne du backend vers le format frontend
 */
export function mapBackendPersonneToFrontend(backendPersonne: BackendPersonne): FrontendPersonne {
  return {
    // Frontend format
    id: backendPersonne.id_personne.toString(),
    nom: backendPersonne.nom,
    prenom: backendPersonne.prenom,
    email: backendPersonne.email,
    telephone: backendPersonne.telephone,
    date_naissance: backendPersonne.date_naissance,
    biographie: backendPersonne.biographie,
    
    // Champs backend pour compatibilité
    id_personne: backendPersonne.id_personne,
  };
}

/**
 * Convertit une liste de personnes du backend vers le format frontend
 */
export function mapBackendPersonnesToFrontend(backendPersonnes: BackendPersonne[]): FrontendPersonne[] {
  return backendPersonnes.map(mapBackendPersonneToFrontend);
}

/**
 * Convertit une participation du backend vers le format frontend
 */
export function mapBackendParticipationToFrontend(backendParticipation: BackendParticipation): FrontendParticipation {
  const personne = backendParticipation.personne 
    ? mapBackendPersonneToFrontend(backendParticipation.personne) 
    : undefined;

  const poste = backendParticipation.poste 
    ? {
        id: backendParticipation.poste.id_poste.toString(),
        nom: backendParticipation.poste.nom,
        code: backendParticipation.poste.code,
      }
    : undefined;

  // Déterminer si c'est un film ou une série
  const isSerie = backendParticipation.contenu?.est_serie;
  const idFilm = isSerie ? undefined : backendParticipation.id_contenu.toString();
  const idSerie = isSerie ? backendParticipation.id_contenu.toString() : undefined;

  return {
    // Frontend format
    id: `${backendParticipation.id_contenu}-${backendParticipation.id_personne}-${backendParticipation.id_poste}`,
    idPersonne: backendParticipation.id_personne.toString(),
    idPoste: backendParticipation.id_poste.toString(),
    idFilm,
    idSerie,
    detail_fonction: backendParticipation.detail_fonction,
    ordre_affichage: backendParticipation.ordre_affichage,
    personne,
    poste,
    
    // Champs backend pour compatibilité
    id_contenu: backendParticipation.id_contenu,
    id_personne: backendParticipation.id_personne,
    id_poste: backendParticipation.id_poste,
  };
}

/**
 * Convertit une liste de participations du backend vers le format frontend
 */
export function mapBackendParticipationsToFrontend(backendParticipations: BackendParticipation[]): FrontendParticipation[] {
  return backendParticipations.map(mapBackendParticipationToFrontend);
}

/**
 * Convertit les données du formulaire vers le format backend
 */
export function mapFrontendParticipationToBackend(formData: any) {
  return {
    idContenu: formData.idFilm ? parseInt(formData.idFilm) : parseInt(formData.idSerie),
    idPersonne: parseInt(formData.idPersonne),
    idPoste: parseInt(formData.idPoste),
    detailFonction: formData.detail_fonction,
    ordreAffichage: formData.ordre_affichage ? parseInt(formData.ordre_affichage) : 999,
  };
}
