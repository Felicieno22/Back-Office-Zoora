/**
 * Mapper pour convertir les données matériel du backend vers le format frontend
 */

export interface BackendMateriel {
  id_materiel: number;
  id_type: number;
  nom: string;
  marque: string;
  modele?: string;
  numero_serie: string;
  etat: string;
  date_achat?: string;
  // Jointure avec typeMateriel
  type_materiel?: {
    id_type: number;
    nom: string;
    code?: string;
  };
}

export interface FrontendMateriel {
  id: string;
  designation: string;
  idTypeMateriel: string;
  numero_serie: string;
  etat: string;
  // Champs supplémentaires pour compatibilité
  id_materiel: number;
  id_type: number;
  nom: string;
  marque: string;
  modele?: string;
  numeroSerie: string;
  date_achat?: string;
  type_materiel?: any;
}

export interface MaterielFormData {
  designation: string;
  idTypeMateriel: string;
  numero_serie: string;
  etat: string;
}

/**
 * Convertit un matériel du backend vers le format frontend
 */
export function mapBackendMaterielToFrontend(backendMateriel: BackendMateriel): FrontendMateriel {
  return {
    // Frontend format
    id: backendMateriel.id_materiel.toString(),
    designation: `${backendMateriel.nom} ${backendMateriel.marque}${backendMateriel.modele ? ' ' + backendMateriel.modele : ''}`.trim(),
    idTypeMateriel: backendMateriel.id_type.toString(),
    numero_serie: backendMateriel.numero_serie,
    etat: mapEtatToFrontend(backendMateriel.etat),
    
    // Champs backend pour compatibilité
    id_materiel: backendMateriel.id_materiel,
    id_type: backendMateriel.id_type,
    nom: backendMateriel.nom,
    marque: backendMateriel.marque,
    modele: backendMateriel.modele,
    numeroSerie: backendMateriel.numero_serie,
    date_achat: backendMateriel.date_achat,
    type_materiel: backendMateriel.type_materiel,
  };
}

/**
 * Convertit une liste de matériels du backend vers le format frontend
 */
export function mapBackendMaterielsToFrontend(backendMateriels: BackendMateriel[]): FrontendMateriel[] {
  return backendMateriels.map(mapBackendMaterielToFrontend);
}

/**
 * Convertit les données du formulaire vers le format backend
 */
export function mapFrontendFormToBackend(formData: MaterielFormData) {
  // Sépare designation en nom/marque/modele
  const parts = formData.designation.split(' ');
  const nom = parts[0] || '';
  const marque = parts[1] || '';
  const modele = parts.slice(2).join(' ') || undefined;

  return {
    idType: parseInt(formData.idTypeMateriel),
    nom,
    marque,
    modele: modele || undefined,
    numeroSerie: formData.numero_serie,
    etat: mapEtatToBackend(formData.etat),
  };
}

/**
 * Map l'état du backend vers le frontend
 */
function mapEtatToFrontend(backendEtat: string): string {
  const etatMap: { [key: string]: string } = {
    'operationnel': 'Bon',
    'en-maintenance': 'En réparation',
    'hs': 'Endommagé',
    'perdu': 'Archivé',
  };
  return etatMap[backendEtat] || backendEtat;
}

/**
 * Map l'état du frontend vers le backend
 */
function mapEtatToBackend(frontendEtat: string): string {
  const etatMap: { [key: string]: string } = {
    'Bon': 'operationnel',
    'En réparation': 'en-maintenance',
    'Endommagé': 'hs',
    'Archivé': 'perdu',
  };
  return etatMap[frontendEtat] || frontendEtat;
}
