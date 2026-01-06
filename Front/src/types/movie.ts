export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  year: number;
  genre: string;
  rating: string; // Classification (PG-13, R, PG, etc.)
  score?: number; // Note numérique (0-10)
  featured?: boolean;
  releaseYear?: number;
  director?: string;
}