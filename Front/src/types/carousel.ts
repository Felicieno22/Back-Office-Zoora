/**
 * Types pour les carrousels
 * Correspondent à la table carrousels en base de données
 */

export interface Carousel {
  idCarrousel: number;
  titre: string;
  description?: string;
  imageUrl: string;
  lienUrl: string;
  ordreAffichage: number;
  statut: 'actif' | 'inactif';
  dateDebut?: string; // YYYY-MM-DD
  dateFin?: string;   // YYYY-MM-DD
  idContenu?: number;
  dateCreation: string; // ISO 8601
}

// Form data for creating/editing carousel
export interface CarouselFormData {
  titre: string;
  description?: string;
  imageUrl: string;
  lienUrl: string;
  ordreAffichage: number;
  statut: 'actif' | 'inactif';
  dateDebut?: string;
  dateFin?: string;
  idContenu?: number;
}

// API response types
export interface CarouselApiResponse {
  data: Carousel;
  status: number;
  message?: string;
}

export interface CarouselListApiResponse {
  data: Carousel[];
  total: number;
  page: number;
  limit: number;
}

// Props for components
export interface CarouselCardProps {
  carousel: Carousel;
  isDarkMode?: boolean;
  onEdit?: (carousel: Carousel) => void;
  onDelete?: (id: number) => void;
}

export interface CarouselFormProps {
  carousel?: Carousel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (carousel: Carousel) => void;
  onError?: (error: string) => void;
  isDarkMode?: boolean;
}

export interface CarouselListProps {
  isDarkMode?: boolean;
}