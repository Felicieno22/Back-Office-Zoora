import { Tv, Loader2, Search, Edit, Trash2, Eye, ChevronUp, ChevronDown, AlertCircle, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getSeries } from '../../utils/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
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
import React from 'react';
import { isValidResponse, handleDataResponse, handleApiError } from '../../utils/errorHandler';

interface SeriesListProps {
  isDarkMode?: boolean;
  series?: any[];
  onDeleteSerie?: (id: string) => void;
}

type SortField = 'titre' | 'date' | 'nombreSaisons';

export function SeriesList({ isDarkMode = false, series: initialSeries = [], onDeleteSerie }: SeriesListProps) {
  const navigate = useNavigate();
  const [series, setSeries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('titre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // getSeries garantit un tableau - plus besoin de validation complexe
      const seriesData = await getSeries();
      setSeries(seriesData);
      
      if (seriesData.length > 0) {
        toast.success('Séries chargées avec succès');
      } else {
        console.log('No series data available from backend');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      
      const apiError = handleApiError(error);
      setError(apiError.message);
      
      // Only show toast for actual errors, not missing data
      if (apiError.code !== 'NOT_FOUND') {
        toast.error(apiError.message);
      }
      
      setSeries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const allGenres = Array.from(new Set(series.filter(s => s.genre).map(s => s.genre))).sort();
  const allStatuts = ['Brouillon', 'Publié', 'Archivé'];

  const filteredSeries = series
    .filter(s => s.titre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(s => genreFilter === '' || s.genre === genreFilter)
    .filter(s => statutFilter === '' || s.statut === statutFilter)
    .sort((a, b) => {
      let aVal: any = a[sortBy] || '';
      let bVal: any = b[sortBy] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filteredSeries.length / itemsPerPage);
  const paginatedSeries = filteredSeries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    
    // Animation de chargement
    const toastId = toast.loading('Suppression en cours...');
    
    try {
      await apiRequest(`/api/series/${deleteId}`, { method: 'DELETE' });
      
      // Animation de suppression avec délai pour l'effet visuel
      setTimeout(() => {
        setSeries(prev => prev.filter(s => s.id_contenu !== deleteId));
        toast.success('Série supprimée avec succès !', { id: toastId });
        setDeleteId(null);
      }, 300);
      
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la suppression', { id: toastId });
      setDeleteId(null);
    }
  };

  const handleViewDetails = (serieId: string) => {
    // Redirection directe vers la page de détails
    // La page SeriesDetails gérera entièrement le chargement des données
    navigate(`/series/${serieId}`);
  };

  const handleEdit = (serieId: string) => {
    // Redirection directe vers la page d'édition
    // La page SeriesEdit gérera entièrement le chargement des données
    navigate(`/series/${serieId}/edit`);
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <span className="text-xs text-gray-400">⇅</span>;
    return sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Publié': 'bg-green-100 text-green-800',
      'Brouillon': 'bg-gray-100 text-gray-800',
      'Archivé': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Erreur de connexion</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchSeries}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      
      <div>
        <h1 className="text-3xl font-bold">Séries</h1>
        <p className="text-gray-500 mt-1">{filteredSeries.length} séries trouvées</p>
      </div>

      <div className="space-y-4">
        <ThemedField
          moduleName="series"
          label=""
          type="text"
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Rechercher par titre..."
          icon={Search}
          useAdvancedFocus={true}
          useModernBorder={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThemedField
            moduleName="series"
            label="Genre"
            type="select"
            value={genreFilter}
            onChange={(value) => {
              setGenreFilter(value);
              setCurrentPage(1);
            }}
            options={[{ value: '', label: 'Tous les genres' }, ...allGenres.map(g => ({ value: g, label: g }))]}
            useAdvancedFocus={true}
            useModernBorder={true}
          />

          <ThemedField
            moduleName="series"
            label="Statut"
            type="select"
            value={statutFilter}
            onChange={(value) => {
              setStatutFilter(value);
              setCurrentPage(1);
            }}
            options={[{ value: '', label: 'Tous les statuts' }, ...allStatuts.map(s => ({ value: s, label: s }))]}
            useAdvancedFocus={true}
            useModernBorder={true}
          />

          <ThemedField
            moduleName="series"
            label="Trier par"
            type="select"
            value={sortBy}
            onChange={(value) => {
              setSortBy(value as SortField);
              setCurrentPage(1);
            }}
            options={[
              { value: 'titre', label: 'Titre' },
              { value: 'date', label: 'Date' },
              { value: 'nombreSaisons', label: 'Saisons' }
            ]}
            useAdvancedFocus={true}
            useModernBorder={true}
          />
        </div>
      </div>

      <ThemedCard 
        moduleName="series" 
        title="Liste des séries" 
        subtitle={`Affichage de ${paginatedSeries.length} sur ${filteredSeries.length} séries`}
        hoverable={true}
        useAdvancedHover={true}
      >
          {paginatedSeries.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune série trouvée</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 cursor-pointer" onClick={() => toggleSort('titre')}>
                      <div className="flex items-center gap-2">Titre <SortIcon field="titre" /></div>
                    </th>
                    <th className="text-left py-3 px-4">Genre</th>
                    <th className="text-left py-3 px-4 cursor-pointer" onClick={() => toggleSort('nombreSaisons')}>
                      <div className="flex items-center gap-2">Saisons <SortIcon field="nombreSaisons" /></div>
                    </th>
                    <th className="text-left py-3 px-4">Statut</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSeries.map((serie) => (
                    <tr key={serie.id_contenu || serie.id || `serie-${Math.random()}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{serie.titre}</td>
                      <td className="py-3 px-4">{serie.genre || '-'}</td>
                      <td className="py-3 px-4">{serie.nombreSaisons || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(serie.statut)}`}>
                          {serie.statut || 'Brouillon'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <ThemedButton
                            moduleName="series"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewDetails(serie.id_contenu)}
                            title="Voir les détails"
                            useGradient={true}
                            useHoverScale={true}
                            useAdvancedShadow={true}
                          >
                            <Eye className="h-4 w-4" />
                          </ThemedButton>
                          <ThemedButton
                            moduleName="series"
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(serie.id_contenu)}
                            title="Modifier la série"
                            useGradient={true}
                            useHoverScale={true}
                            useAdvancedShadow={true}
                          >
                            <Edit className="h-4 w-4" />
                          </ThemedButton>
                          <ThemedButton
                            moduleName="series"
                            variant="error"
                            size="sm"
                            onClick={() => setDeleteId(serie.id_contenu)}
                            title="Supprimer la série"
                            useGradient={true}
                            useHoverScale={true}
                            useAdvancedShadow={true}
                          >
                            <Trash2 className="h-4 w-4" />
                          </ThemedButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</p>
              <div className="flex gap-2">
                <ThemedButton 
                  moduleName="series"
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1}
                  useGradient={true}
                  useHoverScale={true}
                  useAdvancedShadow={true}
                >
                  Précédent
                </ThemedButton>
                <ThemedButton 
                  moduleName="series"
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
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
        </ThemedCard>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Supprimer cette série ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {deleteId && (() => {
                const serieToDelete = series.find(s => s.id_contenu === deleteId);
                return serieToDelete ? (
                  <div className="space-y-2 mt-2">
                    <p className="font-semibold text-gray-900">{serieToDelete.titre}</p>
                    <p className="text-sm text-gray-600">
                      {serieToDelete.genre && <span>Genre: {serieToDelete.genre}</span>}
                      {serieToDelete.nombreSaisons && <span> • {serieToDelete.nombreSaisons} saison(s)</span>}
                    </p>
                    <p className="text-red-600 font-medium text-sm">
                      ⚠️ Cette action est irréversible et supprimera définitivement la série et toutes ses données associées.
                    </p>
                  </div>
                ) : (
                  <p className="text-red-600">
                    ⚠️ Cette action est irréversible. La série sera définitivement supprimée.
                  </p>
                );
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ThemedButton
              moduleName="series"
              variant="secondary"
              onClick={() => setDeleteId(null)}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Annuler
            </ThemedButton>
            <ThemedButton
              moduleName="series"
              variant="error"
              onClick={handleDelete}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Oui, supprimer
            </ThemedButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}