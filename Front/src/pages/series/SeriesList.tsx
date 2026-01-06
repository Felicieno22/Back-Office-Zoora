import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Tv, Search, Edit, Trash2, Eye } from 'lucide-react';
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

interface SeriesListProps {
  isDarkMode: boolean;
  series: any[];
  onDeleteSerie: (id: string) => void;
}

export function SeriesList({ isDarkMode, series, onDeleteSerie }: SeriesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredSeries = series.filter(serie => {
    const matchesSearch = serie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serie.director?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || serie.genre === genreFilter;
    const matchesStatus = statusFilter === 'all' || serie.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const handleDelete = () => {
    if (deleteId) {
      onDeleteSerie(deleteId);
      toast.success('Série supprimée avec succès');
      setDeleteId(null);
    }
  };

  const genres = ['all', ...Array.from(new Set(series.map(s => s.genre)))];
  const statuses = ['all', 'En cours', 'Terminée', 'En pause'];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En cours': return 'bg-green-600/20 text-green-400';
      case 'Terminée': return 'bg-blue-600/20 text-blue-400';
      case 'En pause': return 'bg-yellow-600/20 text-yellow-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
          <Tv className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Liste des séries
          </h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {filteredSeries.length} série(s) trouvée(s)
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input
              placeholder="Rechercher une série..."
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={`w-full md:w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {statuses.filter(s => s !== 'all').map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
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
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Statut</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Saisons/Épisodes</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Note</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSeries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Aucune série trouvée
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredSeries.map((serie) => (
                <TableRow 
                  key={serie.id} 
                  className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50'}
                >
                  <TableCell>
                    <img 
                      src={serie.thumbnail} 
                      alt={serie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {serie.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={isDarkMode ? 'bg-purple-600/20 text-purple-400' : ''}>
                      {serie.genre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(serie.status)}>
                      {serie.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {serie.seasons}S / {serie.episodes}E
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}>★</span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {serie.rating?.toFixed(1) || 'N/A'}
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
                        className={isDarkMode ? 'hover:bg-gray-800 text-purple-400' : 'text-purple-600'}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteId(serie.id)}
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
              Êtes-vous sûr de vouloir supprimer cette série ? Cette action est irréversible.
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
