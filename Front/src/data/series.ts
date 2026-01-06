export interface Serie {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  rating: number;
  seasons: number;
  episodes: number;
  status: 'En cours' | 'Terminée' | 'En pause';
  thumbnail: string;
  director: string;
  cast: string[];
}

export const series: Serie[] = [
  {
    id: '1',
    title: 'Breaking Bad',
    description: 'Un professeur de chimie atteint d\'un cancer se lance dans la production de méthamphétamine.',
    genre: 'Drame',
    releaseYear: 2008,
    rating: 9.5,
    seasons: 5,
    episodes: 62,
    status: 'Terminée',
    thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
    director: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn']
  },
  {
    id: '2',
    title: 'Stranger Things',
    description: 'Dans les années 80, des événements surnaturels se produisent dans une petite ville.',
    genre: 'Science-Fiction',
    releaseYear: 2016,
    rating: 8.7,
    seasons: 4,
    episodes: 42,
    status: 'En cours',
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
    director: 'Les frères Duffer',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder']
  },
  {
    id: '3',
    title: 'The Crown',
    description: 'L\'histoire du règne de la reine Elizabeth II.',
    genre: 'Historique',
    releaseYear: 2016,
    rating: 8.6,
    seasons: 6,
    episodes: 60,
    status: 'Terminée',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
    director: 'Peter Morgan',
    cast: ['Claire Foy', 'Olivia Colman', 'Imelda Staunton']
  },
  {
    id: '4',
    title: 'The Witcher',
    description: 'Les aventures de Geralt de Riv, un chasseur de monstres solitaire.',
    genre: 'Fantasy',
    releaseYear: 2019,
    rating: 8.0,
    seasons: 3,
    episodes: 24,
    status: 'En cours',
    thumbnail: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
    director: 'Lauren Schmidt Hissrich',
    cast: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan']
  },
  {
    id: '5',
    title: 'Peaky Blinders',
    description: 'L\'ascension d\'un gang de Birmingham dans l\'Angleterre de l\'après-guerre.',
    genre: 'Crime',
    releaseYear: 2013,
    rating: 8.8,
    seasons: 6,
    episodes: 36,
    status: 'Terminée',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
    director: 'Steven Knight',
    cast: ['Cillian Murphy', 'Paul Anderson', 'Helen McCrory']
  }
];
