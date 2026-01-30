import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Film, Search, Edit, Trash2, Eye, Loader2, 
  Plus, Calendar, Shield, Activity, TrendingUp, FileText, AlignLeft, Globe 
} from 'lucide-react';
import { toast } from 'sonner';

import { mapBackendFilmsToFrontend, FrontendMovie } from '../../utils/filmMappers';
import { ThemedCard } from "../../components/ui/ThemedCard";
import { ThemedButton } from "../../components/ui/ThemedButton";
import { ThemedField } from "../../components/ui/ThemedField";
import { ThemedIcon } from "../../components/ui/ThemedIcon";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { apiRequest, getFilms } from "../../utils/api";
import { dropdownDataService, useConstantData, Genre } from '../../services/dropdownDataService';

export function FilmsList({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const navigate = useNavigate();
  
  // États de données
  const [movies, setMovies] = useState<FrontendMovie[]>([]);
  const [stats, setStats] = useState<{ total: number; published: number; recent: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: genres } = useConstantData<Genre>(() => dropdownDataService.getGenres());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Appels parallèles : Liste + Stats
      const [filmsData, statsData] = await Promise.all([
        getFilms(),
        apiRequest('/api/films/stats', { method: 'GET' }).catch(() => null) // Fallback si stats non implémenté
      ]);

      // Plus besoin de vérification - getFilms garantit un tableau
      const backendFilms = filmsData;
      setMovies(mapBackendFilmsToFrontend(backendFilms));
      if (statsData) setStats(statsData);
      
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiRequest(`/api/films/${deleteId}`, { method: 'DELETE' });
      setMovies(prev => prev.filter(m => m.id !== deleteId));
      toast.success('Film supprimé avec succès');
      setDeleteId(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredMovies = movies
    .filter(m => (m.titre || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(m => genreFilter === 'all' || m.genre === genreFilter);

  const paginatedMovies = filteredMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-sm text-muted-foreground animate-pulse">Chargement du catalogue...</p>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* 1. HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestion des Films
          </h1>
          <p className="text-muted-foreground text-sm">Administrez les contenus de la plateforme Zoora</p>
        </div>
        <ThemedButton 
          moduleName="films" 
          onClick={() => navigate('/admin/films/create')} 
          variant="primary"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <Plus className="mr-2 h-4 w-4" /> Nouveau Film
        </ThemedButton>
      </div>

      {/* Cartes Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ThemedCard 
          moduleName="films" 
          padding="md"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="flex items-center gap-4">
            <ThemedIcon 
              moduleName="films" 
              icon={Film} 
              size="md" 
              variant="gradient"
              useHover={true}
            />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Total</p>
              <p className="text-2xl font-black">{stats?.total || movies.length}</p>
            </div>
          </div>
        </ThemedCard>
        <ThemedCard 
          moduleName="films" 
          padding="md"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="flex items-center gap-4">
            <ThemedIcon 
              moduleName="films" 
              icon={TrendingUp} 
              size="md" 
              variant="gradient"
              useHover={true}
            />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Sorties récentes</p>
              <p className="text-2xl font-black">{stats?.recent || 0}</p>
            </div>
          </div>
        </ThemedCard>
        <ThemedCard 
          moduleName="films" 
          padding="md"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="flex items-center gap-4">
            <ThemedIcon 
              moduleName="films" 
              icon={Shield} 
              size="md" 
              variant="gradient"
              useHover={true}
            />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Classifiés</p>
              <p className="text-2xl font-black">{filteredMovies.filter(m => m.classification).length}</p>
            </div>
          </div>
        </ThemedCard>
      </div>

      {/* 2. FILTRES */}
      <ThemedCard 
        moduleName="films" 
        className="p-4 flex flex-col md:flex-row gap-4"
        hoverable={true}
        useAdvancedHover={true}
      >
        <div className="flex-1">
          <ThemedField
            moduleName="films"
            label="Recherche"
            type="text"
            placeholder="Rechercher un film par titre..."
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
            icon={Search}
            useAdvancedFocus={true}
            useModernBorder={true}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <ThemedField
            moduleName="films"
            label="Genre"
            type="select"
            value={genreFilter}
            onChange={(value: string) => setGenreFilter(value)}
            options={[{ value: 'all', label: 'Tous les genres' }, ...(genres?.map(g => ({ value: g.nom, label: g.nom })) || [])]}
            icon={Globe}
            useAdvancedFocus={true}
            useModernBorder={true}
          />
        </div>
      </ThemedCard>

      {/* 3. TABLEAU */}
      <div className={`rounded-xl border ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'bg-white shadow-sm overflow-hidden'}`}>
        <Table>
          <TableHeader className={isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}>
            <TableRow>
              <TableHead className="w-[300px]">Film</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Sortie</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMovies.length > 0 ? paginatedMovies.map((film) => (
              <TableRow key={film.id} className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'hover:bg-gray-50/50'}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-7 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                      {film.miniature ? <img src={film.miniature} alt="" className="h-full w-full object-cover" /> : <Film className="m-auto h-4 w-4 text-gray-400" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{film.titre}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{film.realisateur || 'Sans réalisateur'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300' : 'bg-gray-100'}>{film.genre}</Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {film.date_sortie ? new Date(film.date_sortie).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }) : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={film.classification === 'tout-public' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
                    {film.classification || 'TP'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <ThemedButton
                      moduleName="films"
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/films/edit/${film.id}`)}
                      className="h-8 w-8 p-0"
                      useGradient={true}
                      useHoverScale={true}
                      useAdvancedShadow={true}
                    >
                      <Edit className="h-4 w-4" />
                    </ThemedButton>
                    <ThemedButton
                      moduleName="films"
                      variant="error"
                      size="sm"
                      onClick={() => setDeleteId(film.id)}
                      className="h-8 w-8 p-0"
                      useGradient={true}
                      useHoverScale={true}
                      useAdvancedShadow={true}
                    >
                      <Trash2 className="h-4 w-4" />
                    </ThemedButton>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Aucun film ne correspond à votre recherche.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={`p-4 flex items-center justify-between border-t ${isDarkMode ? 'border-gray-800' : ''}`}>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Page {currentPage} sur {totalPages}</span>
            <div className="flex gap-2">
              <ThemedButton
                moduleName="films"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                useGradient={true}
                useHoverScale={true}
                useAdvancedShadow={true}
              >
                Précédent
              </ThemedButton>
              <ThemedButton
                moduleName="films"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                useGradient={true}
                useHoverScale={true}
                useAdvancedShadow={true}
              >
                Suivant
              </ThemedButton>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRMATION SUPPRESSION */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className={isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer définitivement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera le film de la base de données et rendra le Playback ID Mux inutilisable sur Zoora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ThemedButton
              moduleName="films"
              variant="secondary"
              onClick={() => setDeleteId(null)}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Annuler
            </ThemedButton>
            <ThemedButton
              moduleName="films"
              variant="error"
              onClick={handleDelete}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Supprimer
            </ThemedButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

