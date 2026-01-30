/**
 * Mappers pour les types Admin
 * Transformations API → Frontend et Frontend → API
 */

import {
  Utilisateur,
  Soustitrage,
  Personne,
  Poste,
  Participation,
  Materiel,
  MaterielUtilise,
  LogActivite,
  ValidationAdmin,
  SoustitrageFormData,
  PersonneFormData,
  ParticipationFormData,
  MaterielFormData
} from '../types/admin';

// ============ API TO FRONTEND ============

export const mapApiUtilisateur = (apiData: any): Utilisateur => {
  return {
    id_utilisateur: apiData.id_utilisateur,
    nom: apiData.nom,
    email: apiData.email,
    date_naissance: apiData.date_naissance,
    date_inscription: apiData.date_inscription,
    est_actif: apiData.est_actif,
    tentatives_echouees: apiData.tentatives_echouees,
    verrouille_jusqua: apiData.verrouille_jusqua,
    roles: apiData.roles || []
  };
};

export const mapApiSoustitrage = (apiData: any): Soustitrage => {
  return {
    id_soustitrage: apiData.id_soustitrage,
    id_contenu: apiData.id_contenu,
    id_episode: apiData.id_episode,
    langue: apiData.langue,
    url_fichier: apiData.url_fichier,
    est_force: apiData.est_force || false,
    date_ajout: apiData.date_ajout
  };
};

export const mapApiPersonne = (apiData: any): Personne => {
  return {
    id_personne: apiData.id_personne,
    nom: apiData.nom,
    prenom: apiData.prenom,
    email: apiData.email,
    telephone: apiData.telephone,
    date_naissance: apiData.date_naissance,
    biographie: apiData.biographie
  };
};

export const mapApiPoste = (apiData: any): Poste => {
  return {
    id_poste: apiData.id_poste,
    nom: apiData.nom,
    code: apiData.code
  };
};

export const mapApiParticipation = (apiData: any): Participation => {
  return {
    id_contenu: apiData.id_contenu,
    id_personne: apiData.id_personne,
    id_poste: apiData.id_poste,
    detail_fonction: apiData.detail_fonction,
    ordre_affichage: apiData.ordre_affichage || 999,
    personne: apiData.personne ? mapApiPersonne(apiData.personne) : undefined,
    poste: apiData.poste ? mapApiPoste(apiData.poste) : undefined
  };
};

export const mapApiMateriel = (apiData: any): Materiel => {
  return {
    id_materiel: apiData.id_materiel,
    id_type: apiData.id_type,
    nom: apiData.nom,
    marque: apiData.marque,
    modele: apiData.modele,
    numero_serie: apiData.numero_serie,
    etat: apiData.etat,
    date_achat: apiData.date_achat,
    type_materiel: apiData.type_materiel
  };
};

export const mapApiMaterielUtilise = (apiData: any): MaterielUtilise => {
  return {
    id_contenu: apiData.id_contenu,
    id_materiel: apiData.id_materiel,
    id_personne: apiData.id_personne,
    date_debut: apiData.date_debut,
    date_fin: apiData.date_fin,
    notes: apiData.notes,
    materiel: apiData.materiel ? mapApiMateriel(apiData.materiel) : undefined,
    personne: apiData.personne ? mapApiPersonne(apiData.personne) : undefined
  };
};

export const mapApiLogActivite = (apiData: any): LogActivite => {
  return {
    id_log: apiData.id_log,
    id_utilisateur: apiData.id_utilisateur,
    action: apiData.action,
    details: apiData.details,
    date_log: apiData.date_log,
    utilisateur: apiData.utilisateur ? mapApiUtilisateur(apiData.utilisateur) : undefined
  };
};

export const mapApiValidationAdmin = (apiData: any): ValidationAdmin => {
  let donnees_parsees;
  try {
    donnees_parsees = JSON.parse(apiData.donnees_proposees);
  } catch {
    donnees_parsees = apiData.donnees_proposees;
  }

  return {
    id_validation: apiData.id_validation,
    type_cible: apiData.type_cible,
    id_cible: apiData.id_cible,
    id_utilisateur: apiData.id_utilisateur,
    donnees_proposees: apiData.donnees_proposees,
    statut: apiData.statut,
    date_creation: apiData.date_creation,
    utilisateur: apiData.utilisateur ? mapApiUtilisateur(apiData.utilisateur) : undefined,
    donnees_parsees
  };
};

// ============ FRONTEND TO API ============

export const formatSoustitrageForApi = (formData: SoustitrageFormData): any => {
  return {
    langue: formData.langue,
    url_fichier: formData.url_fichier,
    est_force: formData.est_force
  };
};

export const formatPersonneForApi = (formData: PersonneFormData): any => {
  return {
    nom: formData.nom,
    prenom: formData.prenom || null,
    email: formData.email || null,
    telephone: formData.telephone || null,
    date_naissance: formData.date_naissance || null,
    biographie: formData.biographie || null
  };
};

export const formatParticipationForApi = (formData: ParticipationFormData): any => {
  return {
    id_personne: formData.id_personne,
    id_poste: formData.id_poste,
    detail_fonction: formData.detail_fonction || null,
    ordre_affichage: formData.ordre_affichage || 999
  };
};

export const formatMaterielForApi = (formData: MaterielFormData): any => {
  return {
    id_type: formData.id_type,
    nom: formData.nom,
    marque: formData.marque,
    modele: formData.modele || null,
    numero_serie: formData.numero_serie,
    etat: formData.etat,
    date_achat: formData.date_achat || null
  };
};

// ============ UTILITY FUNCTIONS ============

/**
 * Récupère le label du poste par son code
 */
export const getPosteLabel = (posteId: number, postes: Poste[]): string => {
  const poste = postes.find(p => p.id_poste === posteId);
  return poste?.nom || 'Inconnu';
};

/**
 * Groupe les participations par poste
 */
export const groupParticipationsByPoste = (
  participations: Participation[]
): Map<number, Participation[]> => {
  const grouped = new Map<number, Participation[]>();
  participations.forEach(p => {
    if (!grouped.has(p.id_poste)) {
      grouped.set(p.id_poste, []);
    }
    grouped.get(p.id_poste)!.push(p);
  });
  return grouped;
};

/**
 * Filtre le matériel par état
 */
export const filterMaterielByEtat = (
  materiel: Materiel[],
  etat: string
): Materiel[] => {
  if (!etat) return materiel;
  return materiel.filter(m => m.etat === etat);
};

/**
 * Filtre le matériel par type
 */
export const filterMaterielByType = (
  materiel: Materiel[],
  typeId: number
): Materiel[] => {
  if (!typeId) return materiel;
  return materiel.filter(m => m.id_type === typeId);
};

/**
 * Recherche de personne par nom
 */
export const searchPersonnes = (
  personnes: Personne[],
  searchTerm: string
): Personne[] => {
  if (!searchTerm) return personnes;
  const term = searchTerm.toLowerCase();
  return personnes.filter(p =>
    p.nom.toLowerCase().includes(term) ||
    (p.prenom?.toLowerCase().includes(term) ?? false)
  );
};

/**
 * Formate le nom complet d'une personne
 */
export const formatFullName = (personne: Personne): string => {
  if (personne.prenom) {
    return `${personne.prenom} ${personne.nom}`;
  }
  return personne.nom;
};

/**
 * Récupère les logs récents
 */
export const getRecentLogs = (logs: LogActivite[], limit: number = 10): LogActivite[] => {
  return logs
    .sort((a, b) => new Date(b.date_log).getTime() - new Date(a.date_log).getTime())
    .slice(0, limit);
};

/**
 * Filtre les validations par statut
 */
export const filterValidationsByStatus = (
  validations: ValidationAdmin[],
  statut: string
): ValidationAdmin[] => {
  if (!statut) return validations;
  return validations.filter(v => v.statut === statut);
};
