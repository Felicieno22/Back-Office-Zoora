import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Film, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

interface FilmsListProps {
  isDarkMode: boolean;
  movies: any[];
  onDeleteMovie: (id: string) => void;
}

export function FilmsList({ isDarkMode, movies, onDeleteMovie }: FilmsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || movie.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleDelete = () => {
    if (deleteId) {
      onDeleteMovie(deleteId);
      toast.success('Film supprimé avec succès');
      setDeleteId(null);
    }
  };

  const genres = ['all', ...Array.from(new Set(movies.map(m => m.genre)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
          <Film className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Liste des films
          </h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {filteredMovies.length} film(s) trouvé(s)
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input
              placeholder="Rechercher un film..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className={`w-full md:w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
              <SelectValue placeholder="Tous les genres" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <SelectItem value="all">Tous les genres</SelectItem>
              {genres.filter(g => g !== 'all').map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <Table>
          <TableHeader>
            <TableRow className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : ''}>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Affiche</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Titre</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Genre</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Réalisateur</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Année</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Note</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Aucun film trouvé
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMovies.map((movie) => (
                <TableRow 
                  key={movie.id} 
                  className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50'}
                >
                  <TableCell>
                    <img 
                      src={movie.thumbnail} 
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {movie.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={isDarkMode ? 'bg-blue-600/20 text-blue-400' : ''}>
                      {movie.genre}
                    </Badge>
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {movie.director}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {movie.releaseYear}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}>★</span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {movie.score ? movie.score.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={isDarkMode ? 'hover:bg-gray-800 text-gray-400' : ''}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={isDarkMode ? 'hover:bg-gray-800 text-blue-400' : 'text-blue-600'}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteId(movie.id)}
                        className={isDarkMode ? 'hover:bg-gray-800 text-red-400' : 'text-red-600'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className={isDarkMode ? 'bg-gray-900 border-gray-800' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDarkMode ? 'text-white' : ''}>
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Êtes-vous sûr de vouloir supprimer ce film ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}